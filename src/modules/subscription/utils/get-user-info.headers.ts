import { UserWithActiveInboundsEntity } from '../../users/entities/user-with-active-inbounds.entity';

interface SubscriptionUserInfo {
    download: number;
    expire: number;
    total: number;
    upload: number;
}

export function getSubscriptionUserInfo(user: UserWithActiveInboundsEntity): SubscriptionUserInfo {
    return {
        upload: 0,
        download: Number(user.usedTrafficBytes),
        total: Number(user.trafficLimitBytes),
        // TODO: remove after XTLS Standards published
        expire:
            user.expireAt.getFullYear() !== 2099 ? Math.floor(user.expireAt.getTime() / 1000) : 0,
    };
}
