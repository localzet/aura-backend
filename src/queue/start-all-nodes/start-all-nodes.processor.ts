import { Job } from 'bullmq';
import pMap from 'p-map';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, Scope } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { IXrayConfig } from '@common/helpers/xray-config/interfaces';
import { AxiosService } from '@common/axios/axios.service';

import { GetPreparedConfigWithUsersQuery } from '@modules/users/queries/get-prepared-config-with-users';
import { NodesEntity, NodesRepository } from '@modules/nodes';

import { StartNodeQueueService } from '@queue/start-node';

import { StartAllNodesJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(
    {
        name: QueueNames.startAllNodes,
        scope: Scope.REQUEST,
    },
    {
        concurrency: 1,
    },
)
export class StartAllNodesQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(StartAllNodesQueueProcessor.name);
    private readonly CONCURRENCY: number;

    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly axios: AxiosService,
        private readonly startNodeQueueService: StartNodeQueueService,
        private readonly queryBus: QueryBus,
    ) {
        super();
        this.CONCURRENCY = 20;
    }

    async process(job: Job) {
        switch (job.name) {
            case StartAllNodesJobNames.startAllNodes:
                return this.handleStartAllNodes();
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }
    }

    private async handleStartAllNodes() {
        const startTime = Date.now();

        await this.startNodeQueueService.queue.pause();

        try {
            const nodes = await this.nodesRepository.findByCriteria({
                isDisabled: false,
            });

            if (!nodes) {
                return;
            }

            // const { response: nodes } = await this.queryBus.execute<
            //     GetNodesByCriteriaQuery,
            //     ICommandResponse<NodesEntity[]>
            // >(
            //     new GetNodesByCriteriaQuery({
            //         isDisabled: false,
            //     }),
            // );
            // if (!nodes) {
            //     this.logger.debug('No nodes found');
            //     return;
            // }

            for (const node of nodes) {
                await this.nodesRepository.update({
                    uuid: node.uuid,
                    isConnecting: true,
                });
            }

            const config = await this.getConfigForNode({
                excludedInbounds: [],
                excludeInboundsFromConfig: false,
            });

            this.logger.log(`Config for all nodes fetched within: ${Date.now() - startTime}ms`);

            if (!config.isOk || !config.response) {
                throw new Error('Failed to get config');
            }

            const mapper = async (node: NodesEntity) => {
                if (!config.response) {
                    throw new Error('Failed to get config');
                }

                const excludedNodeInboundsTags = node.excludedInbounds.map(
                    (inbound) => inbound.tag,
                );

                const filteredInbounds = config.response.inbounds.filter(
                    (inbound) => !excludedNodeInboundsTags.includes(inbound.tag),
                );

                const response = await this.axios.startXray(
                    { ...config.response, inbounds: filteredInbounds } as unknown as Record<
                        string,
                        unknown
                    >,
                    node.address,
                    node.port,
                );

                switch (response.isOk) {
                    case false:
                        await this.nodesRepository.update({
                            uuid: node.uuid,
                            isXrayRunning: false,
                            isNodeOnline: false,
                            lastStatusMessage: response.message ?? null,
                            lastStatusChange: new Date(),
                            isConnected: false,
                            isConnecting: false,
                            usersOnline: 0,
                        });

                        return;
                    case true:
                        if (!response.response?.response) {
                            throw new Error('Failed to start Xray');
                        }
                        const nodeResponse = response.response.response;

                        await this.nodesRepository.update({
                            uuid: node.uuid,
                            isXrayRunning: nodeResponse.isStarted,
                            xrayVersion: nodeResponse.version,
                            isNodeOnline: true,
                            isConnected: nodeResponse.isStarted,
                            lastStatusMessage: nodeResponse.error ?? null,
                            lastStatusChange: new Date(),
                            isConnecting: false,
                            usersOnline: 0,
                            cpuCount: nodeResponse.systemInformation?.cpuCores ?? null,
                            cpuModel: nodeResponse.systemInformation?.cpuModel ?? null,
                            totalRam: nodeResponse.systemInformation?.memoryTotal ?? null,
                        });

                        return;
                }
            };

            await pMap(nodes, mapper, { concurrency: this.CONCURRENCY });

            this.logger.log(`Started all nodes in ${Date.now() - startTime}ms`);
        } catch (error) {
            this.logger.error(
                `Error handling "${StartAllNodesJobNames.startAllNodes}" job: ${error}`,
            );
        } finally {
            await this.startNodeQueueService.queue.resume();
        }
    }

    private getConfigForNode(
        dto: GetPreparedConfigWithUsersQuery,
    ): Promise<ICommandResponse<IXrayConfig>> {
        return this.queryBus.execute<
            GetPreparedConfigWithUsersQuery,
            ICommandResponse<IXrayConfig>
        >(new GetPreparedConfigWithUsersQuery(dto.excludedInbounds));
    }
}
