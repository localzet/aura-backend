import { NodesUserUsageHistoryEntity } from '../../entities/nodes-user-usage-history.entity';

export class BulkUpsertUserHistoryEntryCommand {
    constructor(public readonly userUsageHistoryList: NodesUserUsageHistoryEntity[]) {
    }
}
