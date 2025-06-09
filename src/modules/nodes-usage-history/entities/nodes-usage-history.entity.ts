import { NodesUsageHistory } from '@prisma/client';

export class NodesUsageHistoryEntity implements NodesUsageHistory {
    public nodeUuid: string;
    public downloadBytes: bigint;
    public uploadBytes: bigint;
    public totalBytes: bigint;
    public createdAt: Date;

    constructor(history: Partial<NodesUsageHistory>) {
        Object.assign(this, history);
        return this;
    }
}
