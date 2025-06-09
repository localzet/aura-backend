import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { AxiosService } from '@common/axios';

import { NodesRepository } from '@modules/nodes/repositories/nodes.repository';

import { StopNodeJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.stopNode, {
    concurrency: 30,
})
export class StopNodeQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(StopNodeQueueProcessor.name);

    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly axios: AxiosService,
    ) {
        super();
    }

    async process(job: Job<{ nodeUuid: string; isNeedToBeDeleted: boolean }>): Promise<boolean> {
        try {
            const { nodeUuid, isNeedToBeDeleted } = job.data;

            const nodeEntity = await this.nodesRepository.findByUUID(nodeUuid);

            if (!nodeEntity) {
                this.logger.error(`Node ${nodeUuid} not found`);
                return false;
            }

            if (isNeedToBeDeleted) {
                await this.nodesRepository.deleteByUUID(nodeUuid);
                return true;
            }

            await this.axios.stopXray(nodeEntity.address, nodeEntity.port);

            if (!isNeedToBeDeleted) {
                await this.nodesRepository.update({
                    uuid: nodeEntity.uuid,
                    isXrayRunning: false,
                    isNodeOnline: false,
                    lastStatusMessage: null,
                    lastStatusChange: new Date(),
                    isConnected: false,
                    isConnecting: false,
                    isDisabled: true,
                });
            }

            return true;
        } catch (error) {
            this.logger.error(`Error handling "${StopNodeJobNames.stopNode}" job: ${error}`);
            return false;
        }
    }
}
