import { Prisma } from '@prisma/client';

import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { ReorderHostRequestDto } from '@modules/hosts/dtos/reorder-hosts.dto';

import { DeleteHostResponseModel } from './models/delete-host.response.model';
import { HostsRepository } from './repositories/hosts.repository';
import { CreateHostRequestDto } from './dtos/create-host.dto';
import { HostsEntity } from './entities/hosts.entity';
import { UpdateHostRequestDto } from './dtos';

@Injectable()
export class HostsService {
    private readonly logger = new Logger(HostsService.name);

    constructor(private readonly hostsRepository: HostsRepository) {
    }

    public async createHost(dto: CreateHostRequestDto): Promise<ICommandResponse<HostsEntity>> {
        try {
            let xHttpExtraParams: null | object | undefined;
            if (dto.xHttpExtraParams !== undefined && dto.xHttpExtraParams !== null) {
                xHttpExtraParams = dto.xHttpExtraParams;
            } else if (dto.xHttpExtraParams === null) {
                xHttpExtraParams = null;
            } else {
                xHttpExtraParams = undefined;
            }

            const hostEntity = new HostsEntity({
                ...dto,
                address: dto.address.trim(),
                xHttpExtraParams,
            });

            const result = await this.hostsRepository.create(hostEntity);

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002' &&
                error.meta?.modelName === 'Hosts' &&
                Array.isArray(error.meta.target)
            ) {
                const fields = error.meta.target as string[];
                if (fields.includes('remark')) {
                    return { isOk: false, ...ERRORS.HOST_REMARK_ALREADY_EXISTS };
                }
            }

            return { isOk: false, ...ERRORS.CREATE_HOST_ERROR };
        }
    }

    public async updateHost(dto: UpdateHostRequestDto): Promise<ICommandResponse<HostsEntity>> {
        try {
            const host = await this.hostsRepository.findByUUID(dto.uuid);
            if (!host) {
                return {
                    isOk: false,
                    ...ERRORS.HOST_NOT_FOUND,
                };
            }

            let xHttpExtraParams: null | object | undefined;
            if (dto.xHttpExtraParams !== undefined && dto.xHttpExtraParams !== null) {
                xHttpExtraParams = dto.xHttpExtraParams;
            } else if (dto.xHttpExtraParams === null) {
                xHttpExtraParams = null;
            } else {
                xHttpExtraParams = undefined;
            }

            const result = await this.hostsRepository.update({
                ...dto,
                address: dto.address ? dto.address.trim() : undefined,
                xHttpExtraParams,
            });

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002' &&
                error.meta?.modelName === 'Hosts' &&
                Array.isArray(error.meta.target)
            ) {
                const fields = error.meta.target as string[];
                if (fields.includes('remark')) {
                    return { isOk: false, ...ERRORS.HOST_REMARK_ALREADY_EXISTS };
                }
            }

            return { isOk: false, ...ERRORS.UPDATE_HOST_ERROR };
        }
    }

    public async deleteHost(hostUuid: string): Promise<ICommandResponse<DeleteHostResponseModel>> {
        try {
            const host = await this.hostsRepository.findByUUID(hostUuid);
            if (!host) {
                return {
                    isOk: false,
                    ...ERRORS.HOST_NOT_FOUND,
                };
            }
            const result = await this.hostsRepository.deleteByUUID(host.uuid);

            return {
                isOk: true,
                response: new DeleteHostResponseModel({
                    isDeleted: result,
                }),
            };
        } catch (error) {
            this.logger.error(error);
            this.logger.error(JSON.stringify(error));
            return { isOk: false, ...ERRORS.DELETE_HOST_ERROR };
        }
    }

    public async getAllHosts(): Promise<ICommandResponse<HostsEntity[]>> {
        try {
            const result = await this.hostsRepository.findAll();

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            return { isOk: false, ...ERRORS.GET_ALL_HOSTS_ERROR };
        }
    }

    public async getOneHost(hostUuid: string): Promise<ICommandResponse<HostsEntity>> {
        try {
            const result = await this.hostsRepository.findByUUID(hostUuid);

            if (!result) {
                return {
                    isOk: false,
                    ...ERRORS.HOST_NOT_FOUND,
                };
            }

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.GET_ONE_HOST_ERROR };
        }
    }

    public async reorderHosts(dto: ReorderHostRequestDto): Promise<
        ICommandResponse<{
            isUpdated: boolean;
        }>
    > {
        try {
            const result = await this.hostsRepository.reorderMany(dto.hosts);

            return {
                isOk: true,
                response: {
                    isUpdated: result,
                },
            };
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            return { isOk: false, ...ERRORS.REORDER_HOSTS_ERROR };
        }
    }

    public async deleteHosts(uuids: string[]): Promise<ICommandResponse<HostsEntity[]>> {
        try {
            await this.hostsRepository.deleteMany(uuids);

            const result = await this.getAllHosts();

            return {
                isOk: true,
                response: result.response,
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.DELETE_HOSTS_ERROR };
        }
    }

    public async bulkEnableHosts(uuids: string[]): Promise<ICommandResponse<HostsEntity[]>> {
        try {
            await this.hostsRepository.enableMany(uuids);

            const result = await this.getAllHosts();

            return {
                isOk: true,
                response: result.response,
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.BULK_ENABLE_HOSTS_ERROR };
        }
    }

    public async bulkDisableHosts(uuids: string[]): Promise<ICommandResponse<HostsEntity[]>> {
        try {
            await this.hostsRepository.disableMany(uuids);

            const result = await this.getAllHosts();

            return {
                isOk: true,
                response: result.response,
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.BULK_DISABLE_HOSTS_ERROR };
        }
    }

    public async setInboundToHosts(
        uuids: string[],
        inboundUuid: string,
    ): Promise<ICommandResponse<HostsEntity[]>> {
        try {
            await this.hostsRepository.setInboundToManyHosts(uuids, inboundUuid);

            const result = await this.getAllHosts();

            return {
                isOk: true,
                response: result.response,
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.SET_INBOUND_TO_HOSTS_ERROR };
        }
    }

    public async setPortToHosts(
        uuids: string[],
        port: number,
    ): Promise<ICommandResponse<HostsEntity[]>> {
        try {
            await this.hostsRepository.setPortToManyHosts(uuids, port);

            const result = await this.getAllHosts();

            return {
                isOk: true,
                response: result.response,
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.SET_PORT_TO_HOSTS_ERROR };
        }
    }
}
