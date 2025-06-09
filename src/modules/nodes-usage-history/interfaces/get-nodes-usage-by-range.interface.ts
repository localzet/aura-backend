export interface IGetNodesUsageByRange {
    nodeName: string;
    nodeUuid: string;
    total: bigint;
    totalDownload: bigint;
    totalUpload: bigint;
    date: string;
}
