import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { GetSystemStatsCommand } from '@localzet/aura-contract';

import { ICommandResponse } from '@common/types/command-response.type';
import { AxiosService } from '@common/axios';
import { EVENTS } from '@localzet/aura-contract';

import { NodeEvent } from '@integration-modules/notifications/interfaces';

import { UpdateNodeCommand } from '@modules/nodes/commands/update-node';
import { NodesEntity } from '@modules/nodes/entities/nodes.entity';

import { StartNodeQueueService } from '@queue/start-node';

import { NodeHealthCheckPayload } from './interfaces/node-health-check.interface';
import { NodeHealthCheckJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.nodeHealthCheck, {
    concurrency: 40,
})
export class NodeHealthCheckQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeHealthCheckQueueProcessor.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventEmitter: EventEmitter2,
        private readonly axios: AxiosService,
        private readonly startNodeService: StartNodeQueueService,
    ) {
        super();
    }

    async process(job: Job<NodeHealthCheckPayload>) {
        try {
            const { nodeAddress, nodePort, nodeUuid, isConnected, isConnecting } = job.data;

            if (isConnecting) {
                this.logger.warn(`Node ${nodeUuid} is connecting, skipping health check`);
                return;
            }

            const response = await this.axios.getSystemStats(nodeAddress, nodePort);
            switch (response.isOk) {
                case true:
                    return this.handleConnectedNode(nodeUuid, isConnected, response.response!);
                case false:
                    return this.handleDisconnectedNode(nodeUuid, isConnected, response.message);
            }
        } catch (error) {
            this.logger.error(
                `Error handling "${NodeHealthCheckJobNames.checkNodeHealth}" job: ${error}`,
            );
            return;
        }
    }

    private async handleConnectedNode(
        nodeUuid: string,
        isConnected: boolean,
        response: GetSystemStatsCommand.Response,
    ) {
        if (typeof response.response.uptime !== 'number') {
            this.logger.error(`Node ${nodeUuid} uptime is not a number`);
            return;
        }

        const nodeUpdatedResponse = await this.updateNode({
            node: {
                uuid: nodeUuid,
                isConnected: true,
                isNodeOnline: true,
                isXrayRunning: true,
                lastStatusChange: new Date(),
                lastStatusMessage: '',
                xrayUptime: response.response.uptime.toString(),
            },
        });

        if (!nodeUpdatedResponse.isOk || !nodeUpdatedResponse.response) {
            return;
        }

        if (!isConnected) {
            this.eventEmitter.emit(
                EVENTS.NODE.CONNECTION_RESTORED,
                new NodeEvent(nodeUpdatedResponse.response, EVENTS.NODE.CONNECTION_RESTORED),
            );
        }

        return;
    }

    private async handleDisconnectedNode(
        nodeUuid: string,
        isConnected: boolean,
        message: string | undefined,
    ) {
        const newNodeEntity = await this.updateNode({
            node: {
                uuid: nodeUuid,
                isConnected: false,
                isNodeOnline: false,
                isXrayRunning: false,
                lastStatusChange: new Date(),
                lastStatusMessage: message,
                usersOnline: 0,
                xrayUptime: '0',
            },
        });

        if (!newNodeEntity.isOk || !newNodeEntity.response) {
            return;
        }

        await this.startNodeService.startNode({ nodeUuid });

        if (isConnected) {
            this.eventEmitter.emit(
                EVENTS.NODE.CONNECTION_LOST,
                new NodeEvent(newNodeEntity.response, EVENTS.NODE.CONNECTION_LOST),
            );
        }

        return;
    }

    private async updateNode(dto: UpdateNodeCommand): Promise<ICommandResponse<NodesEntity>> {
        return this.commandBus.execute<UpdateNodeCommand, ICommandResponse<NodesEntity>>(
            new UpdateNodeCommand(dto.node),
        );
    }
}
