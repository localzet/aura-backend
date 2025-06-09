import { IGetUserUsageByRange } from '../interfaces';

export class GetUserUsageByRangeResponseModel {
    public readonly userUuid: string;
    public readonly nodeUuid: string;
    public readonly nodeName: string;
    public readonly total: number;
    public readonly date: Date;

    constructor(data: IGetUserUsageByRange) {
        this.userUuid = data.userUuid;
        this.nodeUuid = data.nodeUuid;
        this.nodeName = data.nodeName;
        this.total = Number(data.total);
        this.date = new Date(data.date);
    }
}
