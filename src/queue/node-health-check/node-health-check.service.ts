import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { NodesEntity } from '@modules/nodes';

import { NodeHealthCheckPayload } from './interfaces/node-health-check.interface';
import { AbstractQueueService } from '../queue.service';
import { NodeHealthCheckJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Injectable()
export class NodeHealthCheckQueueService
    extends AbstractQueueService
    implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(
        _.upperFirst(_.camelCase(QueueNames.nodeHealthCheck)),
    );

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(
        @InjectQueue(QueueNames.nodeHealthCheck) private readonly nodeHealthCheckQueue: Queue,
    ) {
        super();
        this._queue = this.nodeHealthCheckQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
    }

    public async checkNodeHealth(payload: Record<string, string>) {
        return this.addJob(NodeHealthCheckJobNames.checkNodeHealth, payload, {});
    }

    public async checkNodeHealthBulk(payload: NodesEntity[]) {
        return this.addBulk(
            payload.map((node) => {
                const data: NodeHealthCheckPayload = {
                    nodeUuid: node.uuid,
                    nodeAddress: node.address,
                    nodePort: node.port,
                    isConnected: node.isConnected,
                    isConnecting: node.isConnecting,
                };

                return {
                    name: NodeHealthCheckJobNames.checkNodeHealth,
                    data,
                    opts: {
                        jobId: `${NodeHealthCheckJobNames.checkNodeHealth}-${node.uuid}`,
                        removeOnComplete: true,
                        removeOnFail: true,
                    },
                };
            }),
        );
    }
}
