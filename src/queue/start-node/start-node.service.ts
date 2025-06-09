import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { AbstractQueueService } from '../queue.service';
import { StartNodeJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Injectable()
export class StartNodeQueueService extends AbstractQueueService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(_.upperFirst(_.camelCase(QueueNames.startNode)));

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(@InjectQueue(QueueNames.startNode) private readonly startNodeQueue: Queue) {
        super();
        this._queue = this.startNodeQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async startNode(payload: { nodeUuid: string }) {
        return this.addJob(StartNodeJobNames.startNode, payload, {
            jobId: `${StartNodeJobNames.startNode}-${payload.nodeUuid}`,
            removeOnComplete: true,
            removeOnFail: true,
        });
    }
}
