import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { IXrayConfig } from '@common/helpers/xray-config/interfaces';
import { AxiosService } from '@common/axios/axios.service';
import { EVENTS } from '@localzet/aura-contract';

import { NodeEvent } from '@integration-modules/notifications/interfaces';

import { GetPreparedConfigWithUsersQuery } from '@modules/users/queries/get-prepared-config-with-users';
import { InboundsEntity } from '@modules/inbounds/entities/inbounds.entity';
import { NodesRepository } from '@modules/nodes';

import { StartNodeJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.startNode, {
    concurrency: 40,
})
export class StartNodeQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(StartNodeQueueProcessor.name);

    constructor(
        private readonly axios: AxiosService,
        private readonly nodesRepository: NodesRepository,
        private readonly queryBus: QueryBus,
        private readonly eventEmitter: EventEmitter2,
    ) {
        super();
    }

    async process(job: Job<{ nodeUuid: string }>) {
        try {
            const { nodeUuid } = job.data;

            const nodeEntity = await this.nodesRepository.findByUUID(nodeUuid);

            if (!nodeEntity) {
                this.logger.error(`Node ${nodeUuid} not found`);
                return;
            }

            if (nodeEntity.isConnecting) {
                return;
            }

            await this.nodesRepository.update({
                uuid: nodeEntity.uuid,
                isConnecting: true,
            });

            const xrayStatusResponse = await this.axios.getNodeHealth(
                nodeEntity.address,
                nodeEntity.port,
            );

            if (!xrayStatusResponse.isOk) {
                await this.nodesRepository.update({
                    uuid: nodeEntity.uuid,
                    isXrayRunning: false,
                    isNodeOnline: false,
                    lastStatusMessage: xrayStatusResponse.message ?? null,
                    lastStatusChange: new Date(),
                    isConnected: false,
                    isConnecting: false,
                    usersOnline: 0,
                });

                return;
            }

            const startTime = Date.now();
            const config = await this.getConfigForNode(nodeEntity.excludedInbounds);

            this.logger.log(`Generated config for node in ${Date.now() - startTime}ms`);

            if (!config.isOk || !config.response) {
                throw new Error('Failed to get config for node');
            }

            const reqStartTime = Date.now();

            const res = await this.axios.startXray(
                config.response as unknown as Record<string, unknown>,
                nodeEntity.address,
                nodeEntity.port,
            );

            this.logger.log(`Started node in ${Date.now() - reqStartTime}ms`);

            if (!res.isOk || !res.response) {
                await this.nodesRepository.update({
                    uuid: nodeEntity.uuid,
                    isXrayRunning: false,
                    isNodeOnline: false,
                    lastStatusMessage: res.message ?? null,
                    lastStatusChange: new Date(),
                    isConnected: false,
                    isConnecting: false,
                    usersOnline: 0,
                });
                return;
            }

            const nodeResponse = res.response.response;

            const node = await this.nodesRepository.update({
                uuid: nodeEntity.uuid,
                isXrayRunning: nodeResponse.isStarted,
                xrayVersion: nodeResponse.version,
                isNodeOnline: true,
                isConnected: nodeResponse.isStarted,
                lastStatusMessage: nodeResponse.error ?? null,
                lastStatusChange: new Date(),
                isConnecting: false,
                cpuCount: nodeResponse.systemInformation?.cpuCores ?? null,
                cpuModel: nodeResponse.systemInformation?.cpuModel ?? null,
                totalRam: nodeResponse.systemInformation?.memoryTotal ?? null,
                usersOnline: 0,
            });

            if (!nodeEntity.isConnected) {
                this.eventEmitter.emit(
                    EVENTS.NODE.CONNECTION_RESTORED,
                    new NodeEvent(node, EVENTS.NODE.CONNECTION_RESTORED),
                );
            }

            return;
        } catch (error) {
            this.logger.error(`Error handling "${StartNodeJobNames.startNode}" job: ${error}`);
        }
    }

    private getConfigForNode(
        excludedInbounds: InboundsEntity[],
    ): Promise<ICommandResponse<IXrayConfig>> {
        return this.queryBus.execute<
            GetPreparedConfigWithUsersQuery,
            ICommandResponse<IXrayConfig>
        >(new GetPreparedConfigWithUsersQuery(excludedInbounds));
    }
}
