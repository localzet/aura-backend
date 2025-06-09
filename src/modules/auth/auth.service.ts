import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { TelegramOAuth2 } from '@exact-team/telegram-oauth2';
import { promisify } from 'node:util';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@libs/contracts/constants/errors';
import { EVENTS, ROLE } from '@libs/contracts/constants';

import { ServiceEvent } from '@integration-modules/notifications/interfaces';

import { GetAdminByUsernameQuery } from '@modules/admin/queries/get-admin-by-username';
import { CountAdminsByRoleQuery } from '@modules/admin/queries/count-admins-by-role';
import { GetFirstAdminQuery } from '@modules/admin/queries/get-first-admin';
import { CreateAdminCommand } from '@modules/admin/commands/create-admin';
import { AdminEntity } from '@modules/admin/entities/admin.entity';

import { GetStatusResponseModel } from './model/get-status.response.model';
import { TelegramCallbackRequestDto } from './dtos';
import { ILogin, IRegister } from './interfaces';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly jwtSecret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly eventEmitter: EventEmitter2,
    ) {
        this.jwtSecret = this.configService.getOrThrow<string>('JWT_AUTH_SECRET');
    }

    public async login(
        dto: ILogin,
        ip: string,
        userAgent: string,
    ): Promise<
        ICommandResponse<{
            accessToken: string;
        }>
    > {
        try {
            const { username, password } = dto;

            const statusResponse = await this.getStatus();

            if (!statusResponse.isOk || !statusResponse.response) {
                return {
                    isOk: false,
                    ...ERRORS.GET_AUTH_STATUS_ERROR,
                };
            }

            if (!statusResponse.response.isLoginAllowed) {
                await this.emitFailedLoginAttempt(
                    username,
                    password,
                    ip,
                    userAgent,
                    'Login is not allowed.',
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            if (statusResponse.response.tgAuth) {
                await this.emitFailedLoginAttempt(
                    username,
                    password,
                    ip,
                    userAgent,
                    'Telegram Oauth enabled, so username/password login is disabled.',
                );

                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const admin = await this.getAdminByUsername({
                username,
                role: ROLE.ADMIN,
            });

            if (!admin.isOk || !admin.response) {
                await this.emitFailedLoginAttempt(
                    username,
                    password,
                    ip,
                    userAgent,
                    'Admin is not found in database.',
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const isPasswordValid = await this.verifyPassword(
                password,
                admin.response.passwordHash,
            );

            if (!isPasswordValid) {
                await this.emitFailedLoginAttempt(
                    username,
                    password,
                    ip,
                    userAgent,
                    'Invalid password.',
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const accessToken = this.jwtService.sign(
                {
                    username,
                    uuid: admin.response.uuid,
                    role: ROLE.ADMIN,
                },
                { expiresIn: '12h' },
            );

            await this.emitLoginSuccess(username, ip, userAgent);

            return {
                isOk: true,
                response: { accessToken },
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.LOGIN_ERROR,
            };
        }
    }

    public async register(dto: IRegister): Promise<
        ICommandResponse<{
            accessToken: string;
        }>
    > {
        try {
            const { username, password } = dto;

            const statusResponse = await this.getStatus();

            if (!statusResponse.isOk || !statusResponse.response) {
                return {
                    isOk: false,
                    ...ERRORS.GET_AUTH_STATUS_ERROR,
                };
            }

            if (!statusResponse.response.isRegisterAllowed) {
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const admin = await this.getAdminByUsername({
                username,
                role: ROLE.ADMIN,
            });

            if (admin.isOk && admin.response) {
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const hashedPassword = await this.hashPassword(password);

            const createAdminResponse = await this.createAdmin({
                username,
                password: hashedPassword,
                role: ROLE.ADMIN,
            });

            if (!createAdminResponse.isOk || !createAdminResponse.response) {
                return {
                    isOk: false,
                    ...ERRORS.CREATE_ADMIN_ERROR,
                };
            }

            const accessToken = this.jwtService.sign(
                {
                    username,
                    uuid: createAdminResponse.response.uuid,
                    role: ROLE.ADMIN,
                },
                { expiresIn: '12h' },
            );

            return {
                isOk: true,
                response: { accessToken },
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.LOGIN_ERROR,
            };
        }
    }

    public async getStatus(): Promise<ICommandResponse<GetStatusResponseModel>> {
        try {
            const adminCount = await this.getAdminCount();

            if (!adminCount.isOk) {
                return {
                    isOk: false,
                    ...ERRORS.GET_AUTH_STATUS_ERROR,
                };
            }

            if (adminCount.response === undefined) {
                return {
                    isOk: false,
                    ...ERRORS.GET_AUTH_STATUS_ERROR,
                };
            }

            if (adminCount.response === 0) {
                return {
                    isOk: true,
                    response: new GetStatusResponseModel({
                        isLoginAllowed: false,
                        isRegisterAllowed: true,
                        tgAuth: null,
                    }),
                };
            }

            let tgAuth: {
                botId: number;
            } | null = null;
            const isTgAuthEnabled = this.configService.get<string>('TELEGRAM_OAUTH_ENABLED');
            if (isTgAuthEnabled === 'true') {
                const tgAuthInstance = new TelegramOAuth2({
                    botToken: this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
                });
                const botData = tgAuthInstance.getBotId();

                if (botData) {
                    tgAuth = {
                        botId: botData,
                    };
                }
            }

            return {
                isOk: true,
                response: new GetStatusResponseModel({
                    isLoginAllowed: true,
                    isRegisterAllowed: false,
                    tgAuth,
                }),
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_AUTH_STATUS_ERROR,
            };
        }
    }

    public async telegramCallback(
        dto: TelegramCallbackRequestDto,
        ip: string,
        userAgent: string,
    ): Promise<
        ICommandResponse<{
            accessToken: string;
        }>
    > {
        try {
            const { id, username, first_name } = dto;

            const statusResponse = await this.getStatus();

            if (!statusResponse.isOk || !statusResponse.response) {
                return {
                    isOk: false,
                    ...ERRORS.GET_AUTH_STATUS_ERROR,
                };
            }

            if (!statusResponse.response.isLoginAllowed) {
                await this.emitFailedLoginAttempt(
                    username ? `@${username}` : first_name,
                    `Telegram ID: ${id}`,
                    ip,
                    userAgent,
                    'Login is not allowed.',
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const adminIds = this.configService.getOrThrow<number[]>('TELEGRAM_OAUTH_ADMIN_IDS');

            if (!adminIds.includes(id)) {
                await this.emitFailedLoginAttempt(
                    username ? `@${username}` : first_name,
                    `Telegram ID: ${id}`,
                    ip,
                    userAgent,
                    'UserID is not in the allowed list.',
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const isHashValid = new TelegramOAuth2({
                botToken: this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
                validUntil: 15,
            }).handleTelegramOAuthCallback({
                auth_date: dto.auth_date,
                first_name: dto.first_name,
                hash: dto.hash,
                id: id,
                last_name: dto.last_name,
                username: dto.username,
                photo_url: dto.photo_url,
            });

            if (!isHashValid.isSuccess) {
                await this.emitFailedLoginAttempt(
                    username ? `@${username}` : first_name,
                    `Telegram ID: ${id}`,
                    ip,
                    userAgent,
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const firstAdmin = await this.getFirstAdmin();

            if (!firstAdmin.isOk || !firstAdmin.response) {
                await this.emitFailedLoginAttempt(
                    username ? `@${username}` : first_name,
                    `Telegram ID: ${id}`,
                    ip,
                    userAgent,
                    'Superadmin is not found.',
                );
                return {
                    isOk: false,
                    ...ERRORS.FORBIDDEN,
                };
            }

            const accessToken = this.jwtService.sign(
                {
                    username: firstAdmin.response.username,
                    uuid: firstAdmin.response.uuid,
                    role: ROLE.ADMIN,
                },
                { expiresIn: '12h' },
            );

            await this.emitLoginSuccess(
                `${username ? `@${username}` : first_name}, ID: ${id}`,
                ip,
                userAgent,
                'Logged via Telegram OAuth.',
            );

            return {
                isOk: true,
                response: { accessToken },
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.LOGIN_ERROR,
            };
        }
    }

    private async getAdminCount(): Promise<ICommandResponse<number>> {
        return this.queryBus.execute<CountAdminsByRoleQuery, ICommandResponse<number>>(
            new CountAdminsByRoleQuery(ROLE.ADMIN),
        );
    }

    private async getAdminByUsername(
        dto: GetAdminByUsernameQuery,
    ): Promise<ICommandResponse<AdminEntity>> {
        return this.queryBus.execute<GetAdminByUsernameQuery, ICommandResponse<AdminEntity>>(
            new GetAdminByUsernameQuery(dto.username, dto.role),
        );
    }

    private async getFirstAdmin(): Promise<ICommandResponse<AdminEntity>> {
        return this.queryBus.execute<GetFirstAdminQuery, ICommandResponse<AdminEntity>>(
            new GetFirstAdminQuery(ROLE.ADMIN),
        );
    }

    private applySecretHmac(password: string, secret: string): Buffer {
        const hmac = createHmac('sha256', secret);
        hmac.update(password);
        return hmac.digest();
    }

    private async hashPassword(plainPassword: string): Promise<string> {
        const hmacResult = this.applySecretHmac(plainPassword, this.jwtSecret);

        const salt = randomBytes(16).toString('hex');

        const derivedKey = (await scryptAsync(hmacResult.toString('hex'), salt, 64)) as Buffer;
        const hash = derivedKey.toString('hex');

        return `${salt}:${hash}`;
    }

    private async verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
        const hmacResult = this.applySecretHmac(plainPassword, this.jwtSecret);

        const [salt, hash] = storedHash.split(':');

        const derivedKey = (await scryptAsync(hmacResult.toString('hex'), salt, 64)) as Buffer;
        const calculatedHash = derivedKey.toString('hex');

        return timingSafeEqual(Buffer.from(calculatedHash), Buffer.from(hash));
    }

    private async createAdmin(dto: CreateAdminCommand): Promise<ICommandResponse<AdminEntity>> {
        return this.commandBus.execute<CreateAdminCommand, ICommandResponse<AdminEntity>>(
            new CreateAdminCommand(dto.username, dto.password, dto.role),
        );
    }

    private async emitFailedLoginAttempt(
        username: string,
        password: string,
        ip: string,
        userAgent: string,
        description?: string,
    ): Promise<void> {
        this.eventEmitter.emit(
            EVENTS.SERVICE.LOGIN_ATTEMPT_FAILED,
            new ServiceEvent(EVENTS.SERVICE.LOGIN_ATTEMPT_FAILED, {
                loginAttempt: {
                    username,
                    password,
                    ip,
                    userAgent,
                    description: description ?? '–',
                },
            }),
        );
    }

    private async emitLoginSuccess(
        username: string,
        ip: string,
        userAgent: string,
        description?: string,
    ): Promise<void> {
        this.eventEmitter.emit(
            EVENTS.SERVICE.LOGIN_ATTEMPT_SUCCESS,
            new ServiceEvent(EVENTS.SERVICE.LOGIN_ATTEMPT_SUCCESS, {
                loginAttempt: {
                    username,
                    ip,
                    userAgent,
                    description: description ?? '–',
                },
            }),
        );
    }
}
