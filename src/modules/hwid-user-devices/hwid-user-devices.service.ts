import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { GetUserByUuidQuery } from '@modules/users/queries/get-user-by-uuid';
import { UserWithActiveInboundsEntity } from '@modules/users/entities';

import { HwidUserDevicesRepository } from './repositories/hwid-user-devices.repository';
import { HwidUserDeviceEntity } from './entities/hwid-user-device.entity';
import { CreateUserHwidDeviceRequestDto } from './dtos';

@Injectable()
export class HwidUserDevicesService {
    private readonly logger = new Logger(HwidUserDevicesService.name);

    constructor(
        private readonly hwidUserDevicesRepository: HwidUserDevicesRepository,
        private readonly configService: ConfigService,
        private readonly queryBus: QueryBus,
    ) {
    }

    public async createUserHwidDevice(
        dto: CreateUserHwidDeviceRequestDto,
    ): Promise<ICommandResponse<HwidUserDeviceEntity[]>> {
        try {
            const user = await this.getUserByUuid(dto.userUuid);
            if (!user.isOk || !user.response) {
                return {
                    isOk: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            const hwidGlobalDeviceLimit = this.configService.getOrThrow<number>(
                'HWID_FALLBACK_DEVICE_LIMIT',
            );

            const isDeviceExists = await this.hwidUserDevicesRepository.checkHwidExists(
                dto.hwid,
                dto.userUuid,
            );

            if (isDeviceExists) {
                return {
                    isOk: false,
                    ...ERRORS.USER_HWID_DEVICE_ALREADY_EXISTS,
                };
            }

            const count = await this.hwidUserDevicesRepository.countByUserUuid(dto.userUuid);

            const deviceLimit = user.response.hwidDeviceLimit ?? hwidGlobalDeviceLimit;

            if (count >= deviceLimit) {
                return {
                    isOk: false,
                    ...ERRORS.USER_HWID_DEVICE_LIMIT_REACHED,
                };
            }

            await this.hwidUserDevicesRepository.create(new HwidUserDeviceEntity(dto));

            const userHwidDevices = await this.hwidUserDevicesRepository.findByCriteria({
                userUuid: dto.userUuid,
            });

            return {
                isOk: true,
                response: userHwidDevices,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.CREATE_HWID_USER_DEVICE_ERROR,
            };
        }
    }

    public async getUserHwidDevices(
        userUuid: string,
    ): Promise<ICommandResponse<HwidUserDeviceEntity[]>> {
        try {
            const user = await this.getUserByUuid(userUuid);
            if (!user.isOk || !user.response) {
                return {
                    isOk: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            const userHwidDevices = await this.hwidUserDevicesRepository.findByCriteria({
                userUuid,
            });

            return {
                isOk: true,
                response: userHwidDevices,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_USER_HWID_DEVICES_ERROR,
            };
        }
    }

    public async deleteUserHwidDevice(
        hwid: string,
        userUuid: string,
    ): Promise<ICommandResponse<HwidUserDeviceEntity[]>> {
        try {
            const user = await this.getUserByUuid(userUuid);
            if (!user.isOk || !user.response) {
                return {
                    isOk: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            await this.hwidUserDevicesRepository.deleteByHwidAndUserUuid(hwid, userUuid);

            const userHwidDevices = await this.hwidUserDevicesRepository.findByCriteria({
                userUuid,
            });

            return {
                isOk: true,
                response: userHwidDevices,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.DELETE_HWID_USER_DEVICE_ERROR,
            };
        }
    }

    private async getUserByUuid(
        uuid: string,
    ): Promise<ICommandResponse<UserWithActiveInboundsEntity>> {
        return this.queryBus.execute<
            GetUserByUuidQuery,
            ICommandResponse<UserWithActiveInboundsEntity>
        >(new GetUserByUuidQuery(uuid));
    }
}
