interface IBulkUpdateUsedTraffic {
    u: string;
    b: string;
}

export class BulkIncrementUsedTrafficCommand {
    constructor(public readonly userUsageList: IBulkUpdateUsedTraffic[]) {
    }
}
