import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { TUsersStatus, USERS_STATUS } from '@localzet/aura-contract/constants';

import { BulkDeleteByStatusCommand } from '@modules/users/commands/bulk-delete-by-status/bulk-delete-by-status.command';

import { StartAllNodesQueueService } from '@queue/start-all-nodes/start-all-nodes.service';

import { UserActionsJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.userActions)
export class UserActionsQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(UserActionsQueueProcessor.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly startAllNodesQueueService: StartAllNodesQueueService,
    ) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case UserActionsJobNames.bulkDeleteByStatus:
                return this.handleBulkDeleteByStatusJob(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }

        return { isOk: true };
    }

    private async handleBulkDeleteByStatusJob(job: Job<{ status: TUsersStatus }>) {
        this.logger.debug(
            `Handling "${UserActionsJobNames.bulkDeleteByStatus}" job with ID: ${job?.id || ''}, data: ${JSON.stringify(job?.data || '')}`,
        );

        try {
            const { status } = job.data;

            let deletedCount = 0;
            let hasMoreData = true;

            while (hasMoreData) {
                const result = await this.bulkDeleteByStatus(status, 30_000);

                if (!result.response || !result.isOk) {
                    this.logger.error(
                        `Error handling "${UserActionsJobNames.bulkDeleteByStatus}" job: ${result.message}`,
                    );
                    break;
                }

                this.logger.debug(
                    `Deleted ${result.response.deletedCount} users with status "${status}"`,
                );

                deletedCount += result.response.deletedCount;
                hasMoreData = result.response.deletedCount > 0;
            }

            this.logger.log(
                `Deleted ${deletedCount} users with status "${status}", starting all nodes.`,
            );

            if (status === USERS_STATUS.ACTIVE) {
                await this.startAllNodesQueueService.startAllNodesWithoutDeduplication({
                    emitter: 'user-actions',
                });
            }

            return {
                isOk: true,
                response: {
                    deletedCount,
                },
            };
        } catch (error) {
            this.logger.error(
                `Error handling "${UserActionsJobNames.bulkDeleteByStatus}" job: ${error}`,
            );

            return {
                isOk: false,
            };
        }
    }

    private async bulkDeleteByStatus(
        status: TUsersStatus,
        limit?: number,
    ): Promise<
        ICommandResponse<{
            deletedCount: number;
        }>
    > {
        return this.commandBus.execute<
            BulkDeleteByStatusCommand,
            ICommandResponse<{
                deletedCount: number;
            }>
        >(new BulkDeleteByStatusCommand(status, limit));
    }
}
