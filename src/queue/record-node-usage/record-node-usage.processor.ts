import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { GetAllOutboundsStatsCommand } from '@localzet/aura-node-contract';

import { ICommandResponse } from '@common/types/command-response.type';
import { AxiosService } from '@common/axios';

import { UpsertHistoryEntryCommand } from '@modules/nodes-usage-history/commands/upsert-history-entry';
import { IncrementUsedTrafficCommand } from '@modules/nodes/commands/increment-used-traffic';
import { NodesUsageHistoryEntity } from '@modules/nodes-usage-history';

import { RecordNodeUsagePayload } from './interfaces';
import { RecordNodeUsageJobNames } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.recordNodeUsage, {
    concurrency: 100,
})
export class RecordNodeUsageQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(RecordNodeUsageQueueProcessor.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly axios: AxiosService,
    ) {
        super();
    }

    async process(job: Job<RecordNodeUsagePayload>) {
        try {
            const { nodeUuid, nodeAddress, nodePort } = job.data;

            const response = await this.axios.getAllOutboundStats(
                {
                    reset: true,
                },
                nodeAddress,
                nodePort,
            );
            switch (response.isOk) {
                case true:
                    return this.handleOk(nodeUuid, response.response!);
                case false:
                    this.logger.error(
                        `Can't get nodes stats, node: ${nodeUuid}, error: ${JSON.stringify(
                            response,
                        )}`,
                    );
                    return;
            }
        } catch (error) {
            this.logger.error(
                `Error handling "${RecordNodeUsageJobNames.recordNodeUsage}" job: ${error}`,
            );

            return { isOk: false };
        }
    }

    private async handleOk(
        nodeUuid: string,
        response: GetAllOutboundsStatsCommand.Response,
    ): Promise<void> {
        const { totalDownlink, totalUplink } = response.response.outbounds?.reduce(
            (acc, outbound) => ({
                totalDownlink: acc.totalDownlink + (outbound.downlink || 0),
                totalUplink: acc.totalUplink + (outbound.uplink || 0),
            }),
            { totalDownlink: 0, totalUplink: 0 },
        ) || { totalDownlink: 0, totalUplink: 0 };

        if (totalDownlink === 0 && totalUplink === 0) {
            this.logger.debug(`Node ${nodeUuid}: No traffic to record, skipping`);
            return;
        }

        const totalBytes = totalDownlink + totalUplink;

        await this.reportUsageHistory({
            nodeUsageHistory: new NodesUsageHistoryEntity({
                nodeUuid,
                totalBytes: BigInt(totalBytes),
                uploadBytes: BigInt(totalUplink),
                downloadBytes: BigInt(totalDownlink),
                createdAt: new Date(),
            }),
        });

        await this.incrementUsedTraffic({
            nodeUuid,
            bytes: BigInt(totalBytes),
        });

        return;
    }

    private async reportUsageHistory(
        dto: UpsertHistoryEntryCommand,
    ): Promise<ICommandResponse<void>> {
        return this.commandBus.execute<UpsertHistoryEntryCommand, ICommandResponse<void>>(
            new UpsertHistoryEntryCommand(dto.nodeUsageHistory),
        );
    }

    private async incrementUsedTraffic(
        dto: IncrementUsedTrafficCommand,
    ): Promise<ICommandResponse<void>> {
        return this.commandBus.execute<IncrementUsedTrafficCommand, ICommandResponse<void>>(
            new IncrementUsedTrafficCommand(dto.nodeUuid, dto.bytes),
        );
    }
}
