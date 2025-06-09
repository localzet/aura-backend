interface NodeDayStats {
    date: string;
    nodeName: string;
    totalBytes: string;
}

interface NodeDayStatsInput {
    date: string;
    nodeName: string;
    totalBytes: bigint | string;
}

export class GetNodesStatisticsResponseModel {
    lastSevenDays: NodeDayStats[];

    constructor(data: { lastSevenDays: NodeDayStatsInput[] }) {
        this.lastSevenDays = data.lastSevenDays.map((day) => ({
            ...day,
            totalBytes: day.totalBytes.toString(),
        }));
    }
}
