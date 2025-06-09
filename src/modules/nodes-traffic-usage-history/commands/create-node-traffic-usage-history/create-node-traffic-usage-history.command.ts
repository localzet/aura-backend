import { NodesTrafficUsageHistoryEntity } from '../../entities/nodes-traffic-usage-history.entity';

export class CreateNodeTrafficUsageHistoryCommand {
    constructor(public readonly nodeTrafficUsageHistory: NodesTrafficUsageHistoryEntity) {
    }
}
