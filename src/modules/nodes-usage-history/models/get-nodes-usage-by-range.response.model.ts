import { prettyBytesUtil } from '@common/utils/bytes';

import { IGetNodesUsageByRange } from '../interfaces';

export class GetNodesUsageByRangeResponseModel {
    nodeUuid: string;
    nodeName: string;
    total: number;
    totalDownload: number;
    totalUpload: number;
    humanReadableTotal: string;
    humanReadableTotalDownload: string;
    humanReadableTotalUpload: string;
    date: Date;

    constructor(data: IGetNodesUsageByRange) {
        this.nodeUuid = data.nodeUuid;
        this.nodeName = data.nodeName;
        this.total = Number(data.total);
        this.totalDownload = Number(data.totalDownload);
        this.totalUpload = Number(data.totalUpload);
        this.date = new Date(data.date);
        this.humanReadableTotal = prettyBytesUtil(this.total, true, 3, true);
        this.humanReadableTotalDownload = prettyBytesUtil(this.totalDownload, true, 3, true);
        this.humanReadableTotalUpload = prettyBytesUtil(this.totalUpload, true, 3, true);
    }
}
