import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { BulkUpdateUsersRequestDto } from '@modules/users/dtos';

import { AbstractQueueService } from '../queue.service';
import { BulkUserOperationsJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Injectable()
export class BulkUserOperationsQueueService
    extends AbstractQueueService
    implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(
        _.upperFirst(_.camelCase(QueueNames.bulkUserOperations)),
    );

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(
        @InjectQueue(QueueNames.bulkUserOperations) private readonly bulkUserOperationsQueue: Queue,
    ) {
        super();
        this._queue = this.bulkUserOperationsQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async resetUsersTraffic(payload: Record<string, string>) {
        return this.addJob(BulkUserOperationsJobNames.resetUsersTraffic, payload);
    }

    public async revokeUsersSubscription(payload: Record<string, string>) {
        return this.addJob(BulkUserOperationsJobNames.revokeUsersSubscription, payload);
    }

    public async resetUserTrafficBulk(uuids: string[]) {
        return this.addBulk(
            uuids.map((uuid) => ({
                name: BulkUserOperationsJobNames.resetUsersTraffic,
                data: { uuid },
            })),
        );
    }

    public async revokeUsersSubscriptionBulk(uuids: string[]) {
        return this.addBulk(
            uuids.map((uuid) => ({
                name: BulkUserOperationsJobNames.revokeUsersSubscription,
                data: { uuid },
            })),
        );
    }

    public async updateUsersBulk(dto: BulkUpdateUsersRequestDto) {
        return this.addBulk(
            dto.uuids.map((uuid) => ({
                name: BulkUserOperationsJobNames.updateUsers,
                data: {
                    uuid,
                    fields: {
                        ...dto.fields,
                        trafficLimitBytes:
                            dto.fields.trafficLimitBytes !== undefined
                                ? dto.fields.trafficLimitBytes.toString()
                                : undefined,
                        telegramId:
                            dto.fields.telegramId !== undefined
                                ? dto.fields.telegramId === null
                                    ? null
                                    : dto.fields.telegramId.toString()
                                : undefined,
                        description:
                            dto.fields.description !== undefined
                                ? dto.fields.description
                                : undefined,
                        email: dto.fields.email !== undefined ? dto.fields.email : undefined,
                    },
                },
            })),
        );
    }
}
