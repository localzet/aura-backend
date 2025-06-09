import { NodesUserUsageHistoryEntity } from '../../entities/nodes-user-usage-history.entity';

export class UpsertUserHistoryEntryCommand {
    constructor(public readonly userUsageHistory: NodesUserUsageHistoryEntity) {
    }
}
