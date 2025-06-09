import { NodesUsageHistoryEntity } from '../../entities/nodes-usage-history.entity';

export class UpsertHistoryEntryCommand {
    constructor(public readonly nodeUsageHistory: NodesUsageHistoryEntity) {
    }
}
