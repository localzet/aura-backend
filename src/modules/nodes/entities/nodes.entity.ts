import { Nodes } from '@prisma/client';

import { InboundsEntity } from '@modules/inbounds/entities';

import { INodeWithExcludedInbounds } from '../interfaces';

export class NodesEntity implements Nodes {
    public uuid: string;
    public name: string;
    public address: string;
    public port: null | number;
    public isConnected: boolean;
    public isConnecting: boolean;
    public isDisabled: boolean;
    public isNodeOnline: boolean;
    public isXrayRunning: boolean;
    public lastStatusChange: Date | null;
    public lastStatusMessage: null | string;

    public xrayVersion: null | string;
    public xrayUptime: string;

    public usersOnline: null | number;

    public isTrafficTrackingActive: boolean;
    public trafficResetDay: null | number;
    public trafficLimitBytes: bigint | null;
    public trafficUsedBytes: bigint | null;
    public notifyPercent: null | number;

    public viewPosition: number;
    public countryCode: string;
    public consumptionMultiplier: bigint;

    public cpuCount: null | number;
    public cpuModel: null | string;
    public totalRam: null | string;

    public createdAt: Date;
    public updatedAt: Date;

    public excludedInbounds: InboundsEntity[];

    constructor(node: Partial<INodeWithExcludedInbounds> & Partial<Nodes>) {
        const { inboundsExclusions, ...nodeData } = node;

        if (inboundsExclusions) {
            this.excludedInbounds = inboundsExclusions.map((item) => ({
                uuid: item.inbound.uuid,
                tag: item.inbound.tag,
                type: item.inbound.type,
                network: item.inbound.network,
                security: item.inbound.security,
            }));
        }

        Object.assign(this, nodeData);

        return this;
    }
}
