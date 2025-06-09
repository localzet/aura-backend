import { UserTrafficHistory } from '@prisma/client';

export class UserTrafficHistoryEntity implements UserTrafficHistory {
    id: bigint;
    userUuid: string;
    usedBytes: bigint;
    resetAt: Date;
    createdAt: Date;

    constructor(history: Partial<UserTrafficHistory>) {
        Object.assign(this, history);
        return this;
    }
}
