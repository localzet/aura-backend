import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract';

import { SignApiTokenCommand } from '../auth/commands/sign-api-token/sign-api-token.command';
import { IApiTokenDeleteResponse, ICreateApiTokenRequest } from './interfaces';
import { ApiTokensRepository } from './repositories/api-tokens.repository';
import { FindAllApiTokensResponseModel } from './models/find.model';
import { ApiTokenEntity } from './entities/api-token.entity';

@Injectable()
export class ApiTokensService {
    private readonly logger = new Logger(ApiTokensService.name);

    constructor(
        private readonly apiTokensRepository: ApiTokensRepository,
        private readonly commandBus: CommandBus,
        private readonly configService: ConfigService,
    ) {
    }

    public async create(body: ICreateApiTokenRequest): Promise<ICommandResponse<ApiTokenEntity>> {
        const { tokenName, tokenDescription } = body;

        try {
            const uuid = randomUUID();

            const token = await this.signApiToken({
                uuid,
            });

            if (!token.isOk || !token.response) {
                return {
                    isOk: false,
                    ...ERRORS.CREATE_API_TOKEN_ERROR,
                };
            }

            const apiTokenEntity = new ApiTokenEntity({
                uuid,
                tokenName,
                tokenDescription,
                token: token.response,
            });

            const newAoiTokenEntity = await this.apiTokensRepository.create(apiTokenEntity);

            return {
                isOk: true,
                response: newAoiTokenEntity,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.CREATE_API_TOKEN_ERROR,
            };
        }
    }

    public async delete(uuid: string): Promise<ICommandResponse<IApiTokenDeleteResponse>> {
        try {
            const result = await this.apiTokensRepository.deleteByUUID(uuid);

            return {
                isOk: true,
                response: { result },
            };
        } catch (error) {
            this.logger.error(JSON.stringify(error));

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return {
                        isOk: false,
                        ...ERRORS.REQUESTED_TOKEN_NOT_FOUND,
                    };
                }
            }
            return {
                isOk: false,
                ...ERRORS.DELETE_API_TOKEN_ERROR,
            };
        }
    }

    public async findAll(): Promise<ICommandResponse<FindAllApiTokensResponseModel>> {
        try {
            const result = await this.apiTokensRepository.findByCriteria({});

            const isDocsEnabled = this.configService.getOrThrow<string>('IS_DOCS_ENABLED');
            const scalarPath = this.configService.get<string>('SCALAR_PATH') ?? null;
            const swaggerPath = this.configService.get<string>('SWAGGER_PATH') ?? null;

            const docs = {
                isDocsEnabled: isDocsEnabled === 'true',
                scalarPath: scalarPath,
                swaggerPath: swaggerPath,
            };

            return {
                isOk: true,
                response: {
                    apiKeys: result.map((item) => item),
                    docs,
                },
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.FIND_ALL_API_TOKENS_ERROR,
            };
        }
    }

    private async signApiToken(dto: SignApiTokenCommand): Promise<ICommandResponse<string>> {
        return this.commandBus.execute<SignApiTokenCommand, ICommandResponse<string>>(
            new SignApiTokenCommand(dto.uuid),
        );
    }
}
