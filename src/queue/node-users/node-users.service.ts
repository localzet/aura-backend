import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { IAddUserToNodePayload, IRemoveUserFromNodePayload } from './interfaces';
import { AbstractQueueService } from '../queue.service';
import { NodeUsersJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Injectable()
export class NodeUsersQueueService extends AbstractQueueService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(_.upperFirst(_.camelCase(QueueNames.nodeUsers)));

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(@InjectQueue(QueueNames.nodeUsers) private readonly nodeUsersQueue: Queue) {
        super();
        this._queue = this.nodeUsersQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async addUsersToNode(payload: IAddUserToNodePayload) {
        return this.addJob(NodeUsersJobNames.addUserToNode, payload);
    }

    public async removeUserFromNode(payload: IRemoveUserFromNodePayload) {
        return this.addJob(NodeUsersJobNames.removeUserFromNode, payload);
    }

    public async removeUserFromNodeBulk(payload: IRemoveUserFromNodePayload[]) {
        return this.addBulk(
            payload.map((p) => ({
                name: NodeUsersJobNames.removeUserFromNode,
                data: p,
            })),
        );
    }
}
