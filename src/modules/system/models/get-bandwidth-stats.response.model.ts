export interface IBaseStat {
    current: string;
    difference: string;
    previous: string;
}

export class GetBandwidthStatsResponseModel {
    bandwidthLastTwoDays: IBaseStat;
    bandwidthLastSevenDays: IBaseStat;
    bandwidthLast30Days: IBaseStat;
    bandwidthCalendarMonth: IBaseStat;
    bandwidthCurrentYear: IBaseStat;

    constructor(data: GetBandwidthStatsResponseModel) {
        this.bandwidthLastTwoDays = data.bandwidthLastTwoDays;
        this.bandwidthLastSevenDays = data.bandwidthLastSevenDays;
        this.bandwidthLast30Days = data.bandwidthLast30Days;
        this.bandwidthCalendarMonth = data.bandwidthCalendarMonth;
        this.bandwidthCurrentYear = data.bandwidthCurrentYear;
    }
}
