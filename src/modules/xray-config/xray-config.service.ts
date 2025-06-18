import { ERRORS } from '@localzet/aura-backend-contract/constants';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { IXrayConfig } from '@common/helpers/xray-config/interfaces';
import { XRayConfig } from '@common/helpers/xray-config';

import { UpdateInboundCommand } from '@modules/inbounds/commands/update-inbound';

import { StartAllNodesQueueService } from '@queue/start-all-nodes/start-all-nodes.service';

import { InboundsWithTagsAndType } from '../inbounds/interfaces/inbounds-with-tags-and-type.interface';
import { DeleteManyInboundsCommand } from '../inbounds/commands/delete-many-inbounds';
import { CreateManyInboundsCommand } from '../inbounds/commands/create-many-inbounds';
import { XrayConfigRepository } from './repositories/xray-config.repository';
import { GetAllInboundsQuery } from '../inbounds/queries/get-all-inbounds';
import { InboundsEntity } from '../inbounds/entities/inbounds.entity';
import { UpdateConfigRequestDto } from './dtos/update-config.dto';
import { XrayConfigEntity } from './entities/xray-config.entity';

@Injectable()
export class XrayConfigService implements OnApplicationBootstrap {
    private readonly logger = new Logger(XrayConfigService.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly xrayConfigRepository: XrayConfigRepository,
        private readonly startAllNodesQueue: StartAllNodesQueueService,
    ) {
    }

    async onApplicationBootstrap() {
        await this.syncInbounds();
    }

    public async updateConfig(config: object): Promise<ICommandResponse<XrayConfigEntity>> {
        try {
            const existingConfig = await this.xrayConfigRepository.findFirst();
            if (!existingConfig) {
                return await this.createConfig(config);
            }

            const result = await this.xrayConfigRepository.update({
                uuid: existingConfig.uuid,
                config,
            });

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.UPDATE_CONFIG_ERROR,
            };
        }
    }

    public async updateConfigFromController(
        requestConfig: UpdateConfigRequestDto,
    ): Promise<ICommandResponse<XrayConfigEntity>> {
        try {
            const config = requestConfig;

            const existingConfig = await this.xrayConfigRepository.findFirst();
            if (!existingConfig) {
                return await this.createConfig(config);
            }

            const validatedConfig = new XRayConfig(config);
            const sortedConfig = validatedConfig.getSortedConfig();

            const result = await this.xrayConfigRepository.update({
                uuid: existingConfig.uuid,
                config: sortedConfig,
            });

            result.config = sortedConfig;

            await this.syncInbounds();

            await this.startAllNodesQueue.startAllNodes({
                emitter: XrayConfigService.name,
            });

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            if (error instanceof Error) {
                return {
                    isOk: false,
                    ...ERRORS.CONFIG_VALIDATION_ERROR.withMessage(error.message),
                };
            }
            return {
                isOk: false,
                ...ERRORS.CONFIG_VALIDATION_ERROR,
            };
        }
    }

    public async createConfig(config: object): Promise<ICommandResponse<XrayConfigEntity>> {
        try {
            const result = await this.xrayConfigRepository.create(new XrayConfigEntity(config));

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.CREATE_CONFIG_ERROR,
            };
        }
    }

    public async getConfig(): Promise<ICommandResponse<IXrayConfig>> {
        try {
            let config: object | string;
            const dbConfig = await this.xrayConfigRepository.findFirst();
            if (!dbConfig || !dbConfig.config) {
                throw new Error('No XTLS config found in DB!');
            } else {
                config = dbConfig.config;
            }

            const validatedConfig = new XRayConfig(config);
            const sortedConfig = validatedConfig.getSortedConfig();

            const writeDBConfig = await this.updateConfig(sortedConfig);
            if (!writeDBConfig.isOk) {
                throw new Error('Failed to write config to DB');
            }

            return {
                isOk: true,
                response: sortedConfig,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to read config file: ${error.message}`);
            } else {
                this.logger.error(`Failed to read config file: ${error}`);
            }
            return {
                isOk: false,
                ...ERRORS.GET_CONFIG_ERROR,
            };
        }
    }

    public async getConfigInstance(): Promise<null | XRayConfig> {
        try {
            let config: object | string;
            const dbConfig = await this.xrayConfigRepository.findFirst();
            if (!dbConfig || !dbConfig.config) {
                throw new Error('No XTLS config found in DB!');
            } else {
                config = dbConfig.config;
            }

            return XRayConfig.getXrayConfigInstance(config);
        } catch {
            return null;
        }
    }

    public async syncInbounds(): Promise<void> {
        try {
            const config = await this.xrayConfigRepository.findFirst();

            if (!config || !config.config) {
                throw new Error('Failed to get config');
            }

            const parsedConf = new XRayConfig(config.config);
            const configInbounds = parsedConf.getAllInbounds();

            const existingInbounds = await this.getAllInbounds();
            if (!existingInbounds.isOk || !existingInbounds.response) {
                throw new Error('Failed to get existing inbounds');
            }

            const inboundsToRemove = existingInbounds.response.filter((existingInbound) => {
                const configInbound = configInbounds.find((ci) => ci.tag === existingInbound.tag);
                return !configInbound || configInbound.type !== existingInbound.type;
            });

            const inboundsToAdd = configInbounds.filter((configInbound) => {
                if (!existingInbounds.response) {
                    return false;
                }
                const existingInbound = existingInbounds.response.find(
                    (ei) => ei.tag === configInbound.tag,
                );
                return !existingInbound || existingInbound.type !== configInbound.type;
            });

            if (inboundsToRemove.length) {
                const tagsToRemove = inboundsToRemove.map((inbound) => inbound.tag);
                this.logger.log(`Removing inbounds: ${tagsToRemove.join(', ')}`);
                await this.deleteManyInbounds({
                    tags: tagsToRemove,
                });
            }

            if (inboundsToAdd.length) {
                this.logger.log(`Adding inbounds: ${inboundsToAdd.map((i) => i.tag).join(', ')}`);
                await this.createManyInbounds(inboundsToAdd);
            }

            if (inboundsToAdd.length === 0 && inboundsToRemove.length === 0) {
                const inboundsToUpdate = configInbounds
                    .filter((configInbound) => {
                        if (!existingInbounds.response) {
                            return false;
                        }

                        const existingInbound = existingInbounds.response.find(
                            (ei) => ei.tag === configInbound.tag,
                        );

                        if (!existingInbound) {
                            return false;
                        }

                        const securityChanged = configInbound.security !== existingInbound.security;
                        const networkChanged = configInbound.network !== existingInbound.network;

                        return securityChanged || networkChanged;
                    })
                    .map((configInbound) => {
                        const existingInbound = existingInbounds.response?.find(
                            (ei) => ei.tag === configInbound.tag,
                        );

                        // TODO: check this

                        if (!existingInbound) {
                            throw new Error(`Inbound with tag ${configInbound.tag} not found`);
                        }

                        existingInbound.security = configInbound.security;
                        existingInbound.network = configInbound.network;

                        return existingInbound;
                    });

                if (inboundsToUpdate.length) {
                    this.logger.log(
                        `Updating inbounds: ${inboundsToUpdate.map((i) => i.tag).join(', ')}`,
                    );

                    for (const inbound of inboundsToUpdate) {
                        await this.updateInbound({
                            uuid: inbound.uuid,
                            tag: inbound.tag,
                            security: inbound.security,
                            network: inbound.network,
                            type: inbound.type,
                        });
                    }
                }
            }

            this.logger.log('Inbounds synced/updated successfully');
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to sync inbounds:', error.message);
            } else {
                this.logger.error('Failed to sync inbounds:', error);
            }
            throw error;
        }
    }

    private async deleteManyInbounds(
        dto: DeleteManyInboundsCommand,
    ): Promise<ICommandResponse<void>> {
        return this.commandBus.execute<DeleteManyInboundsCommand, ICommandResponse<void>>(
            new DeleteManyInboundsCommand(dto.tags),
        );
    }

    private async createManyInbounds(
        inbounds: InboundsWithTagsAndType[],
    ): Promise<ICommandResponse<void>> {
        return this.commandBus.execute<CreateManyInboundsCommand, ICommandResponse<void>>(
            new CreateManyInboundsCommand(inbounds),
        );
    }

    private async updateInbound(inbound: InboundsEntity): Promise<ICommandResponse<void>> {
        return this.commandBus.execute<UpdateInboundCommand, ICommandResponse<void>>(
            new UpdateInboundCommand(inbound),
        );
    }

    private async getAllInbounds(): Promise<ICommandResponse<InboundsEntity[]>> {
        return this.queryBus.execute<GetAllInboundsQuery, ICommandResponse<InboundsEntity[]>>(
            new GetAllInboundsQuery(),
        );
    }
}
