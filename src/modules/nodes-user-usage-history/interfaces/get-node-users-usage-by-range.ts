export interface IGetNodeUserUsageByRange {
    userUuid: string;
    nodeUuid: string;
    username: string;
    total: bigint;
    date: string;
}
