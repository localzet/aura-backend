import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { XRayConfig } from '@common/helpers/xray-config';
import { ERRORS } from '@localzet/aura-contract';

import { GetValidatedConfigQuery } from '@modules/xray-config/queries/get-validated-config/get-validated-config.query';

import { StartAllNodesQueueService } from '@queue/start-all-nodes/start-all-nodes.service';

import { NodeInboundExclusionsRepository } from './repositories/node-inbound-exclusions.repository';
import { ActiveUserInboundsRepository } from './repositories/active-user-inbounds.repository';
import { InboundsRepository } from './repositories/inbounds.repository';
import { BaseInboundEntity } from './entities/base-inbound.entity';
import { GetFullInboundsResponseModel } from './models';

@Injectable()
export class InboundsService {
    private readonly logger = new Logger(InboundsService.name);

    constructor(
        private readonly inboundsRepository: InboundsRepository,
        private readonly activeUserInboundsRepository: ActiveUserInboundsRepository,
        private readonly nodeInboundExclusionsRepository: NodeInboundExclusionsRepository,
        private readonly startAllNodesQueue: StartAllNodesQueueService,
        private readonly queryBus: QueryBus,
    ) {
    }

    public async getInbounds(): Promise<ICommandResponse<BaseInboundEntity[]>> {
        try {
            const inbounds = await this.inboundsRepository.findAll();

            const validatedConfig = await this.getValidatedConfig();

            if (!validatedConfig) {
                return {
                    isOk: false,
                    ...ERRORS.GET_CONFIG_ERROR,
                };
            }

            const result: BaseInboundEntity[] = [];

            for (const inbound of inbounds) {
                const rawFromConfig = validatedConfig
                    .getConfig()
                    .inbounds.find((i) => i.tag === inbound.tag);

                let port = 0;

                if (typeof rawFromConfig?.port === 'number') {
                    port = rawFromConfig.port;
                } else if (typeof rawFromConfig?.port === 'string') {
                    if (Array.isArray(rawFromConfig.port)) {
                        port = Number(rawFromConfig.port[0]);
                    } else if (rawFromConfig.port.includes(',')) {
                        const ports = rawFromConfig.port.split(',');
                        port = Number(ports[0]);
                    } else {
                        const parsedPort = Number(rawFromConfig.port);
                        port = isNaN(parsedPort) ? 0 : parsedPort;
                    }
                }

                result.push(new BaseInboundEntity(inbound, port));
            }

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(`Error getting inbounds: ${error}`);
            return {
                isOk: false,
                ...ERRORS.FIND_ALL_INBOUNDS_ERROR,
            };
        }
    }

    public async getFullInbounds(): Promise<ICommandResponse<GetFullInboundsResponseModel[]>> {
        try {
            const inbounds = await this.inboundsRepository.findAll();

            const validatedConfig = await this.getValidatedConfig();

            if (!validatedConfig) {
                return {
                    isOk: false,
                    ...ERRORS.GET_CONFIG_ERROR,
                };
            }

            const result: GetFullInboundsResponseModel[] = [];

            for (const inbound of inbounds) {
                const inboundWithStatEntity = await this.inboundsRepository.getInboundStatsByUuid(
                    inbound.uuid,
                );

                if (!inboundWithStatEntity) {
                    continue;
                }

                const rawFromConfig = validatedConfig
                    .getConfig()
                    .inbounds.find((i) => i.tag === inbound.tag);

                let port = 0;

                if (typeof rawFromConfig?.port === 'number') {
                    port = rawFromConfig.port;
                } else if (typeof rawFromConfig?.port === 'string') {
                    if (Array.isArray(rawFromConfig.port)) {
                        port = Number(rawFromConfig.port[0]);
                    } else if (rawFromConfig.port.includes(',')) {
                        const ports = rawFromConfig.port.split(',');
                        port = Number(ports[0]);
                    } else {
                        const parsedPort = Number(rawFromConfig.port);
                        port = isNaN(parsedPort) ? 0 : parsedPort;
                    }
                }

                result.push(
                    new GetFullInboundsResponseModel(
                        inboundWithStatEntity,
                        rawFromConfig as unknown as Record<string, unknown>,
                        port,
                    ),
                );
            }

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(`Error getting inbounds: ${error}`);
            return {
                isOk: false,
                ...ERRORS.FIND_ALL_INBOUNDS_ERROR,
            };
        }
    }

    public async addInboundToUsers(inboundUuid: string): Promise<
        ICommandResponse<{
            isSuccess: boolean;
        }>
    > {
        try {
            const inboundEntity = await this.inboundsRepository.findByUUID(inboundUuid);

            if (!inboundEntity) {
                return {
                    isOk: false,
                    ...ERRORS.INBOUND_NOT_FOUND,
                };
            }

            const result = await this.activeUserInboundsRepository.addInboundToUsers(inboundUuid);

            if (typeof result !== 'number') {
                return {
                    isOk: false,
                    ...ERRORS.ADD_INBOUND_TO_USERS_ERROR,
                };
            }

            await this.startAllNodesQueue.startAllNodesWithoutDeduplication({
                emitter: 'addInboundToUsers',
            });

            return {
                isOk: true,
                response: {
                    isSuccess: result > 0,
                },
            };
        } catch (error) {
            this.logger.error(`Error adding inbound to users: ${error}`);
            return {
                isOk: false,
                ...ERRORS.ADD_INBOUND_TO_USERS_ERROR,
            };
        }
    }

    public async removeInboundFromUsers(inboundUuid: string): Promise<
        ICommandResponse<{
            isSuccess: boolean;
        }>
    > {
        try {
            const inboundEntity = await this.inboundsRepository.findByUUID(inboundUuid);

            if (!inboundEntity) {
                return {
                    isOk: false,
                    ...ERRORS.INBOUND_NOT_FOUND,
                };
            }

            const result =
                await this.activeUserInboundsRepository.removeInboundFromUsers(inboundUuid);

            if (typeof result !== 'number') {
                return {
                    isOk: false,
                    ...ERRORS.REMOVE_INBOUND_FROM_USERS_ERROR,
                };
            }

            await this.startAllNodesQueue.startAllNodesWithoutDeduplication({
                emitter: 'removeInboundFromUsers',
            });

            return {
                isOk: true,
                response: {
                    isSuccess: result > 0,
                },
            };
        } catch (error) {
            this.logger.error(`Error removing inbound from users: ${error}`);
            return {
                isOk: false,
                ...ERRORS.REMOVE_INBOUND_FROM_USERS_ERROR,
            };
        }
    }

    public async addInboundToNodes(inboundUuid: string): Promise<
        ICommandResponse<{
            isSuccess: boolean;
        }>
    > {
        try {
            const inboundEntity = await this.inboundsRepository.findByUUID(inboundUuid);

            if (!inboundEntity) {
                return {
                    isOk: false,
                    ...ERRORS.INBOUND_NOT_FOUND,
                };
            }

            const result =
                await this.nodeInboundExclusionsRepository.addInboundToNodes(inboundUuid);

            if (typeof result !== 'number') {
                return {
                    isOk: false,
                    ...ERRORS.ADD_INBOUND_TO_NODES_ERROR,
                };
            }

            await this.startAllNodesQueue.startAllNodesWithoutDeduplication({
                emitter: 'addInboundToNodes',
            });

            return {
                isOk: true,
                response: {
                    isSuccess: result > 0,
                },
            };
        } catch (error) {
            this.logger.error(`Error adding inbound to nodes: ${error}`);
            return {
                isOk: false,
                ...ERRORS.ADD_INBOUND_TO_NODES_ERROR,
            };
        }
    }

    public async removeInboundFromNodes(inboundUuid: string): Promise<
        ICommandResponse<{
            isSuccess: boolean;
        }>
    > {
        try {
            const inboundEntity = await this.inboundsRepository.findByUUID(inboundUuid);

            if (!inboundEntity) {
                return {
                    isOk: false,
                    ...ERRORS.INBOUND_NOT_FOUND,
                };
            }

            const result =
                await this.nodeInboundExclusionsRepository.removeInboundFromNodes(inboundUuid);

            if (typeof result !== 'number') {
                return {
                    isOk: false,
                    ...ERRORS.REMOVE_INBOUND_FROM_NODES_ERROR,
                };
            }

            await this.startAllNodesQueue.startAllNodesWithoutDeduplication({
                emitter: 'removeInboundFromNodes',
            });

            return {
                isOk: true,
                response: {
                    isSuccess: result > 0,
                },
            };
        } catch (error) {
            this.logger.error(`Error removing inbound from nodes: ${error}`);
            return {
                isOk: false,
                ...ERRORS.REMOVE_INBOUND_FROM_NODES_ERROR,
            };
        }
    }

    private async getValidatedConfig(): Promise<null | XRayConfig> {
        return this.queryBus.execute<GetValidatedConfigQuery, null | XRayConfig>(
            new GetValidatedConfigQuery(),
        );
    }
}
