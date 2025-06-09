export interface IGetNodesRealtimeUsage {
    nodeUuid: string;
    nodeName: string;
    countryCode: string;
    downloadBytes: bigint;
    uploadBytes: bigint;
    totalBytes: bigint;
    downloadSpeedBps: bigint;
    uploadSpeedBps: bigint;
    totalSpeedBps: bigint;
}
