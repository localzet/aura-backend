import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { AbstractQueueService } from '../queue.service';
import { QueueNames } from '../queue.enum';
import { StopNodeJobNames } from './enums';

@Injectable()
export class StopNodeQueueService extends AbstractQueueService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(_.upperFirst(_.camelCase(QueueNames.stopNode)));

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(@InjectQueue(QueueNames.stopNode) private readonly stopNodeQueue: Queue) {
        super();
        this._queue = this.stopNodeQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async stopNode(payload: { nodeUuid: string; isNeedToBeDeleted: boolean }) {
        return this.addJob(StopNodeJobNames.stopNode, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${StopNodeJobNames.stopNode}-${payload.nodeUuid}-${payload.isNeedToBeDeleted}`,
        });
    }
}
