import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Cron } from '@nestjs/schedule';

import { ICommandResponse } from '@common/types/command-response.type';

import { GetOnlineNodesQuery } from '@modules/nodes/queries/get-online-nodes';
import { NodesEntity } from '@modules/nodes';

import { RecordUserUsageQueueService } from '@queue/record-user-usage';

import { JOBS_INTERVALS } from '../../intervals';

@Injectable()
export class RecordUserUsageTask {
    private static readonly CRON_NAME = 'recordUserUsage';
    private readonly logger = new Logger(RecordUserUsageTask.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly recordUserUsageQueueService: RecordUserUsageQueueService,
    ) {
    }

    @Cron(JOBS_INTERVALS.RECORD_USER_USAGE, {
        name: RecordUserUsageTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        let nodes: NodesEntity[] | null = null;

        try {
            const nodesResponse = await this.getOnlineNodes();
            if (!nodesResponse.isOk || !nodesResponse.response) {
                return;
            }

            nodes = nodesResponse.response;

            if (nodes.length === 0) {
                return;
            }

            await this.recordUserUsageQueueService.recordUserUsageBulk(
                nodes.map((node) => ({
                    nodeUuid: node.uuid,
                    nodeAddress: node.address,
                    nodePort: node.port,
                    consumptionMultiplier: node.consumptionMultiplier.toString(),
                })),
            );

            return;
        } catch (error) {
            this.logger.error(`Error in RecordUserUsageTask: ${error}`);
        }
    }

    private async getOnlineNodes(): Promise<ICommandResponse<NodesEntity[]>> {
        return this.queryBus.execute<GetOnlineNodesQuery, ICommandResponse<NodesEntity[]>>(
            new GetOnlineNodesQuery(),
        );
    }
}
