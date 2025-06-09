import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { EVENTS } from '@libs/contracts/constants';

import { UserEvent } from '@integration-modules/notifications/interfaces';

import { UserWithActiveInboundsEntity } from '@modules/users/entities/user-with-active-inbounds.entity';
import { GetUserByUuidQuery } from '@modules/users/queries/get-user-by-uuid/get-user-by-uuid.query';

import { FirstConnectedUsersJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.firstConnectedUsers, {
    concurrency: 50,
})
export class FirstConnectedUsersQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(FirstConnectedUsersQueueProcessor.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly eventEmitter: EventEmitter2,
    ) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case FirstConnectedUsersJobNames.handleFirstConnectedUsers:
                return this.handleFirstConnectedUsers(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }

        return { isOk: true };
    }

    private async handleFirstConnectedUsers(job: Job<{ uuid: string }>) {
        try {
            const userUuids = job.data;

            const user = await this.getUserByUuid(userUuids.uuid);

            if (!user.isOk || !user.response) {
                return { isOk: false };
            }

            this.eventEmitter.emit(
                EVENTS.USER.FIRST_CONNECTED,
                new UserEvent(user.response, EVENTS.USER.FIRST_CONNECTED),
            );
        } catch (error) {
            this.logger.error(
                `Error handling "${FirstConnectedUsersJobNames.handleFirstConnectedUsers}" job: ${error}`,
            );
        }
    }

    private async getUserByUuid(
        uuid: string,
    ): Promise<ICommandResponse<UserWithActiveInboundsEntity>> {
        return this.queryBus.execute<
            GetUserByUuidQuery,
            ICommandResponse<UserWithActiveInboundsEntity>
        >(new GetUserByUuidQuery(uuid));
    }
}
