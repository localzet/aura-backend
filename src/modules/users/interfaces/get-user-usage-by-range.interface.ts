export interface IGetUserUsageByRange {
    userUuid: string;
    nodeUuid: string;
    nodeName: string;
    total: bigint;
    date: string;
}
