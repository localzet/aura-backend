import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { RevokeUserSubscriptionCommand } from '@modules/users/commands/revoke-user-subscription';
import { UpdateUserWithServiceCommand } from '@modules/users/commands/update-user-with-service';
import { ResetUserTrafficCommand } from '@modules/users/commands/reset-user-traffic';
import { UpdateUserRequestDto } from '@modules/users/dtos';

import { BulkUserOperationsJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.bulkUserOperations, {
    concurrency: 500,
})
export class BulkUserOperationsQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(BulkUserOperationsQueueProcessor.name);

    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case BulkUserOperationsJobNames.resetUsersTraffic:
                return this.handleResetUsersTrafficJob(job);
            case BulkUserOperationsJobNames.revokeUsersSubscription:
                return this.handleRevokeUsersSubscriptionJob(job);
            case BulkUserOperationsJobNames.updateUsers:
                return this.handleUpdateUsersJob(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }
    }

    private async handleResetUsersTrafficJob(job: Job) {
        try {
            const { uuid } = job.data;

            const result = await this.resetUserTraffic(uuid);

            if (!result.isOk) {
                return {
                    isOk: false,
                };
            }

            return {
                isOk: true,
            };
        } catch (error) {
            this.logger.error(
                `Error handling "${BulkUserOperationsJobNames.resetUsersTraffic}" job: ${error}`,
            );

            return {
                isOk: false,
            };
        }
    }

    private async handleRevokeUsersSubscriptionJob(job: Job) {
        try {
            const { uuid } = job.data;

            const result = await this.revokeUserSubscription(uuid);

            if (!result.isOk) {
                return {
                    isOk: false,
                };
            }

            return {
                isOk: true,
            };
        } catch (error) {
            this.logger.error(
                `Error handling "${BulkUserOperationsJobNames.revokeUsersSubscription}" job: ${error}`,
            );
        }
    }

    private async handleUpdateUsersJob(job: Job) {
        try {
            const { uuid, fields } = job.data;

            const result = await this.updateUsers({
                uuid: uuid,
                ...fields,
                trafficLimitBytes:
                    fields.trafficLimitBytes !== undefined
                        ? Number(fields.trafficLimitBytes)
                        : undefined,
                telegramId:
                    fields.telegramId !== undefined
                        ? fields.telegramId === null
                            ? null
                            : Number(fields.telegramId)
                        : undefined,
                description: fields.description !== undefined ? fields.description : undefined,
                email: fields.email !== undefined ? fields.email : undefined,
            });

            if (!result.isOk) {
                return {
                    isOk: false,
                };
            }

            return {
                isOk: true,
            };
        } catch (error) {
            this.logger.error(
                `Error handling "${BulkUserOperationsJobNames.updateUsers}" job: ${error}`,
            );
        }
    }

    private async revokeUserSubscription(uuid: string): Promise<ICommandResponse<boolean>> {
        return this.commandBus.execute<RevokeUserSubscriptionCommand, ICommandResponse<boolean>>(
            new RevokeUserSubscriptionCommand(uuid),
        );
    }

    private async resetUserTraffic(uuid: string): Promise<ICommandResponse<boolean>> {
        return this.commandBus.execute<ResetUserTrafficCommand, ICommandResponse<boolean>>(
            new ResetUserTrafficCommand(uuid),
        );
    }

    private async updateUsers(dto: UpdateUserRequestDto): Promise<ICommandResponse<boolean>> {
        return this.commandBus.execute<UpdateUserWithServiceCommand, ICommandResponse<boolean>>(
            new UpdateUserWithServiceCommand(dto),
        );
    }
}
