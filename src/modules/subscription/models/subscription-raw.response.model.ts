import { TResetPeriods, TUsersStatus } from '@localzet/aura-contract/constants';

export class SubscriptionRawResponse {
    public isFound: boolean;
    public user: {
        daysLeft: number;
        expiresAt: Date;
        isActive: boolean;
        shortUuid: string;
        trafficLimit: string;
        trafficUsed: string;
        username: string;
        userStatus: TUsersStatus;
        trafficLimitStrategy: TResetPeriods;
    };
    public links: string[];
    public ssConfLinks: Record<string, string>;
    public subscriptionUrl: string;
    public happ: {
        cryptoLink: string;
    };

    constructor(data: SubscriptionRawResponse) {
        this.isFound = data.isFound;
        this.user = data.user;
        this.links = data.links || [];
        this.ssConfLinks = data.ssConfLinks || {};
        this.subscriptionUrl = data.subscriptionUrl;
        this.happ = data.happ;
    }
}
