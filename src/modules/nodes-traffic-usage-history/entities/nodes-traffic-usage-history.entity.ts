import { NodesTrafficUsageHistory } from '@prisma/client';

export class NodesTrafficUsageHistoryEntity implements NodesTrafficUsageHistory {
    id: bigint;
    nodeUuid: string;
    trafficBytes: bigint;
    resetAt: Date;

    constructor(history: Partial<NodesTrafficUsageHistory>) {
        Object.assign(this, history);
        return this;
    }
}
