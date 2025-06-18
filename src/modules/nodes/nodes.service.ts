import { Prisma } from '@prisma/client';

import { StartAllNodesQueueService } from 'src/queue/start-all-nodes/start-all-nodes.service';
import { ERRORS, EVENTS } from '@localzet/aura-backend-contract/constants';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { toNano } from '@common/utils/nano';

import { NodeEvent } from '@integration-modules/notifications/interfaces';

import {
    ResetNodeInboundExclusionsByNodeUuidCommand,
} from '@modules/inbounds/commands/reset-node-inbound-exclusions-by-node-uuid';

import { StartNodeQueueService } from '@queue/start-node/start-node.service';
import { StopNodeQueueService } from '@queue/stop-node/stop-node.service';

import { CreateNodeRequestDto, ReorderNodeRequestDto, UpdateNodeRequestDto } from './dtos';
import { DeleteNodeResponseModel, RestartNodeResponseModel } from './models';
import { NodesRepository } from './repositories/nodes.repository';
import { NodesEntity } from './entities';

@Injectable()
export class NodesService {
    private readonly logger = new Logger(NodesService.name);

    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly commandBus: CommandBus,
        private readonly startAllNodesQueue: StartAllNodesQueueService,
        private readonly startNodeQueue: StartNodeQueueService,
        private readonly stopNodeQueue: StopNodeQueueService,
    ) {
    }

    public async createNode(body: CreateNodeRequestDto): Promise<ICommandResponse<NodesEntity>> {
        try {
            const { excludedInbounds, ...nodeData } = body;

            const nodeEntity = new NodesEntity({
                ...nodeData,
                address: nodeData.address.trim(),
                isConnected: false,
                isConnecting: false,
                isDisabled: false,
                isNodeOnline: false,
                isXrayRunning: false,
                trafficLimitBytes: nodeData.trafficLimitBytes
                    ? BigInt(nodeData.trafficLimitBytes)
                    : undefined,
                consumptionMultiplier: nodeData.consumptionMultiplier
                    ? toNano(nodeData.consumptionMultiplier)
                    : undefined,
            });
            const result = await this.nodesRepository.create(nodeEntity);

            if (excludedInbounds) {
                await this.resetNodeInboundExclusions({
                    nodeUuid: result.uuid,
                    excludedInbounds: excludedInbounds,
                });
            }

            const node = await this.nodesRepository.findByUUID(result.uuid);

            if (!node) {
                throw new Error('Node not found');
            }

            await this.startNodeQueue.startNode({
                nodeUuid: node.uuid,
            });

            this.eventEmitter.emit(EVENTS.NODE.CREATED, new NodeEvent(node, EVENTS.NODE.CREATED));

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002' &&
                error.meta?.modelName === 'Nodes' &&
                Array.isArray(error.meta.target)
            ) {
                const fields = error.meta.target as string[];
                if (fields.includes('name')) {
                    return { isOk: false, ...ERRORS.NODE_NAME_ALREADY_EXISTS };
                }
                if (fields.includes('address')) {
                    return { isOk: false, ...ERRORS.NODE_ADDRESS_ALREADY_EXISTS };
                }
            }

            return { isOk: false, ...ERRORS.CREATE_NODE_ERROR };
        }
    }

    public async getAllNodes(): Promise<ICommandResponse<NodesEntity[]>> {
        try {
            return {
                isOk: true,
                response: await this.nodesRepository.findByCriteria({}),
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_ALL_NODES_ERROR,
            };
        }
    }

    public async restartNode(uuid: string): Promise<ICommandResponse<RestartNodeResponseModel>> {
        try {
            const node = await this.nodesRepository.findByUUID(uuid);
            if (!node) {
                return {
                    isOk: false,
                    ...ERRORS.NODE_NOT_FOUND,
                };
            }

            await this.startNodeQueue.startNode({
                nodeUuid: node.uuid,
            });

            return {
                isOk: true,
                response: new RestartNodeResponseModel(true),
            };
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            return {
                isOk: false,
                ...ERRORS.RESTART_NODE_ERROR,
            };
        }
    }

    public async restartAllNodes(): Promise<ICommandResponse<RestartNodeResponseModel>> {
        try {
            const nodes = await this.nodesRepository.findByCriteria({
                isDisabled: false,
            });
            if (nodes.length === 0) {
                return {
                    isOk: false,
                    ...ERRORS.ENABLED_NODES_NOT_FOUND,
                };
            }

            await this.startAllNodesQueue.startAllNodes({
                emitter: NodesService.name,
            });

            return {
                isOk: true,
                response: new RestartNodeResponseModel(true),
            };
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            return {
                isOk: false,
                ...ERRORS.RESTART_NODE_ERROR,
            };
        }
    }

    public async getOneNode(uuid: string): Promise<ICommandResponse<NodesEntity>> {
        try {
            const node = await this.nodesRepository.findByUUID(uuid);
            if (!node) {
                return {
                    isOk: false,
                    ...ERRORS.NODE_NOT_FOUND,
                };
            }

            return {
                isOk: true,
                response: node,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_ONE_NODE_ERROR,
            };
        }
    }

    public async deleteNode(uuid: string): Promise<ICommandResponse<DeleteNodeResponseModel>> {
        try {
            const node = await this.nodesRepository.findByUUID(uuid);
            if (!node) {
                return {
                    isOk: false,
                    ...ERRORS.NODE_NOT_FOUND,
                };
            }

            await this.stopNodeQueue.stopNode({
                nodeUuid: node.uuid,
                isNeedToBeDeleted: true,
            });

            this.eventEmitter.emit(EVENTS.NODE.DELETED, new NodeEvent(node, EVENTS.NODE.DELETED));

            return {
                isOk: true,
                response: new DeleteNodeResponseModel({
                    isDeleted: true,
                }),
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.DELETE_NODE_ERROR,
            };
        }
    }

    public async updateNode(body: UpdateNodeRequestDto): Promise<ICommandResponse<NodesEntity>> {
        try {
            const { excludedInbounds, ...nodeData } = body;

            const node = await this.nodesRepository.findByUUID(body.uuid);
            if (!node) {
                return {
                    isOk: false,
                    ...ERRORS.NODE_NOT_FOUND,
                };
            }

            if (excludedInbounds) {
                await this.resetNodeInboundExclusions({
                    nodeUuid: node.uuid,
                    excludedInbounds: excludedInbounds,
                });
            }

            const result = await this.nodesRepository.update({
                ...nodeData,
                address: nodeData.address ? nodeData.address.trim() : undefined,
                trafficLimitBytes: nodeData.trafficLimitBytes
                    ? BigInt(nodeData.trafficLimitBytes)
                    : undefined,
                consumptionMultiplier: nodeData.consumptionMultiplier
                    ? toNano(nodeData.consumptionMultiplier)
                    : undefined,
            });

            if (!result) {
                return {
                    isOk: false,
                    ...ERRORS.UPDATE_NODE_ERROR,
                };
            }

            if (!node.isDisabled) {
                await this.startNodeQueue.startNode({
                    nodeUuid: result.uuid,
                });
            }

            this.eventEmitter.emit(
                EVENTS.NODE.MODIFIED,
                new NodeEvent(result, EVENTS.NODE.MODIFIED),
            );

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.ENABLE_NODE_ERROR,
            };
        }
    }

    public async enableNode(uuid: string): Promise<ICommandResponse<NodesEntity>> {
        try {
            const node = await this.nodesRepository.findByUUID(uuid);
            if (!node) {
                return {
                    isOk: false,
                    ...ERRORS.NODE_NOT_FOUND,
                };
            }

            const result = await this.nodesRepository.update({
                uuid: node.uuid,
                isDisabled: false,
            });

            if (!result) {
                return {
                    isOk: false,
                    ...ERRORS.ENABLE_NODE_ERROR,
                };
            }

            await this.startNodeQueue.startNode({
                nodeUuid: result.uuid,
            });

            this.eventEmitter.emit(EVENTS.NODE.ENABLED, new NodeEvent(result, EVENTS.NODE.ENABLED));

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.ENABLE_NODE_ERROR,
            };
        }
    }

    public async disableNode(uuid: string): Promise<ICommandResponse<NodesEntity>> {
        try {
            const node = await this.nodesRepository.findByUUID(uuid);
            if (!node) {
                return {
                    isOk: false,
                    ...ERRORS.NODE_NOT_FOUND,
                };
            }

            const result = await this.nodesRepository.update({
                uuid: node.uuid,
                isDisabled: true,
                isConnected: false,
                isConnecting: false,
                isNodeOnline: false,
                isXrayRunning: false,
            });

            if (!result) {
                return {
                    isOk: false,
                    ...ERRORS.DISABLE_NODE_ERROR,
                };
            }

            await this.stopNodeQueue.stopNode({
                nodeUuid: result.uuid,
                isNeedToBeDeleted: false,
            });

            this.eventEmitter.emit(
                EVENTS.NODE.DISABLED,
                new NodeEvent(result, EVENTS.NODE.DISABLED),
            );

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.ENABLE_NODE_ERROR,
            };
        }
    }

    private async resetNodeInboundExclusions(
        dto: ResetNodeInboundExclusionsByNodeUuidCommand,
    ): Promise<ICommandResponse<number>> {
        return this.commandBus.execute<
            ResetNodeInboundExclusionsByNodeUuidCommand,
            ICommandResponse<number>
        >(new ResetNodeInboundExclusionsByNodeUuidCommand(dto.nodeUuid, dto.excludedInbounds));
    }

    public async reorderNodes(
        dto: ReorderNodeRequestDto,
    ): Promise<ICommandResponse<NodesEntity[]>> {
        try {
            await this.nodesRepository.reorderMany(dto.nodes);

            return {
                isOk: true,
                response: await this.nodesRepository.findByCriteria({}),
            };
        } catch (error) {
            this.logger.error(error);
            return { isOk: false, ...ERRORS.REORDER_NODES_ERROR };
        }
    }
}
