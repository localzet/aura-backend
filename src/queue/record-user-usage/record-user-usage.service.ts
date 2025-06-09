import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { AbstractQueueService } from '../queue.service';
import { RecordUserUsagePayload } from './interfaces';
import { RecordUserUsageJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Injectable()
export class RecordUserUsageQueueService
    extends AbstractQueueService
    implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(
        _.upperFirst(_.camelCase(QueueNames.recordUserUsage)),
    );

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(
        @InjectQueue(QueueNames.recordUserUsage) private readonly recordUserUsageQueue: Queue,
    ) {
        super();
        this._queue = this.recordUserUsageQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async recordUserUsage(payload: RecordUserUsagePayload) {
        return this.addJob(RecordUserUsageJobNames.recordUserUsage, payload, {
            jobId: `${RecordUserUsageJobNames.recordUserUsage}-${payload.nodeUuid}`,
            removeOnComplete: true,
            removeOnFail: true,
        });
    }

    public async recordUserUsageBulk(payload: RecordUserUsagePayload[]) {
        return this.addBulk(
            payload.map((node) => {
                return {
                    name: RecordUserUsageJobNames.recordUserUsage,
                    data: node,
                    opts: {
                        jobId: `${RecordUserUsageJobNames.recordUserUsage}-${node.nodeUuid}`,
                        removeOnComplete: true,
                        removeOnFail: true,
                    },
                };
            }),
        );
    }
}
