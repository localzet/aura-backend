import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { AxiosService } from '@common/axios';

import { IAddUserToNodePayload } from './interfaces/add-user-to-node.payload.interface';
import { IRemoveUserFromNodePayload } from './interfaces';
import { NodeUsersJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.nodeUsers, {
    concurrency: 100,
})
export class NodeUsersQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeUsersQueueProcessor.name);

    constructor(private readonly axios: AxiosService) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case NodeUsersJobNames.addUserToNode:
                return this.handleAddUsersToNode(job);
            case NodeUsersJobNames.removeUserFromNode:
                return this.handleRemoveUserFromNode(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }
    }

    private async handleAddUsersToNode(job: Job<IAddUserToNodePayload>) {
        try {
            const { data, node } = job.data;
            const result = await this.axios.addUser(data, node.address, node.port);

            if (!result.isOk) {
                this.logger.error(
                    `Error adding users to node ${node.address}:${node.port}: ${result.message}`,
                );
            }

            return result;
        } catch (error) {
            this.logger.error(`Error handling "${NodeUsersJobNames.addUserToNode}" job: ${error}`);
            return { isOk: false };
        }
    }

    private async handleRemoveUserFromNode(job: Job<IRemoveUserFromNodePayload>) {
        try {
            const { data, node } = job.data;

            const result = await this.axios.deleteUser(data, node.address, node.port);

            if (!result.isOk) {
                this.logger.error(
                    `Error removing user from node ${node.address}:${node.port}: ${result.message}`,
                );
            }

            return result;
        } catch (error) {
            this.logger.error(
                `Error handling "${NodeUsersJobNames.removeUserFromNode}" job: ${error}`,
            );
        }
    }
}
