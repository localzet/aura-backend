import { NodesUserUsageHistory } from '@prisma/client';

export class NodesUserUsageHistoryEntity implements NodesUserUsageHistory {
    nodeUuid: string;
    userUuid: string;
    downloadBytes: bigint;
    uploadBytes: bigint;
    totalBytes: bigint;
    createdAt: Date;
    updatedAt: Date;

    constructor(history: Partial<NodesUserUsageHistory>) {
        Object.assign(this, history);
        return this;
    }
}
