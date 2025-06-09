import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { AbstractQueueService } from '../queue.service';
import { RecordNodeUsagePayload } from './interfaces';
import { RecordNodeUsageJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Injectable()
export class RecordNodeUsageQueueService
    extends AbstractQueueService
    implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(
        _.upperFirst(_.camelCase(QueueNames.recordNodeUsage)),
    );

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(
        @InjectQueue(QueueNames.recordNodeUsage) private readonly recordNodeUsageQueue: Queue,
    ) {
        super();
        this._queue = this.recordNodeUsageQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async recordNodeUsage(payload: RecordNodeUsagePayload) {
        return this.addJob(RecordNodeUsageJobNames.recordNodeUsage, payload, {
            jobId: `${RecordNodeUsageJobNames.recordNodeUsage}-${payload.nodeUuid}`,
            removeOnComplete: true,
            removeOnFail: true,
        });
    }

    public async recordNodeUsageBulk(payload: RecordNodeUsagePayload[]) {
        return this.addBulk(
            payload.map((node) => {
                return {
                    name: RecordNodeUsageJobNames.recordNodeUsage,
                    data: node,
                    opts: {
                        jobId: `${RecordNodeUsageJobNames.recordNodeUsage}-${node.nodeUuid}`,
                        removeOnComplete: true,
                        removeOnFail: true,
                    },
                };
            }),
        );
    }
}
