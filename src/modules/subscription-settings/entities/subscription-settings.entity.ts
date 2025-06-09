import { SubscriptionSettings } from '@prisma/client';

export class SubscriptionSettingsEntity implements SubscriptionSettings {
    uuid: string;
    profileTitle: string;
    supportLink: string;
    profileUpdateInterval: number;
    isProfileWebpageUrlEnabled: boolean;
    serveJsonAtBaseSubscription: boolean;
    addUsernameToBaseSubscription: boolean;
    isShowCustomRemarks: boolean;

    happAnnounce: string | null;
    happRouting: string | null;

    expiredUsersRemarks: string[];
    limitedUsersRemarks: string[];
    disabledUsersRemarks: string[];

    customResponseHeaders: Record<string, string> | null;

    randomizeHosts: boolean;

    createdAt: Date;
    updatedAt: Date;

    constructor(config: Partial<SubscriptionSettings>) {
        Object.assign(this, config);
        return this;
    }
}
