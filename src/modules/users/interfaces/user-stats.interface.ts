import { TUsersStatus } from '@localzet/aura-contract/constants';

export interface IUserOnlineStats {
    lastDay: number;
    lastWeek: number;
    neverOnline: number;
    onlineNow: number;
}

export interface IUserStats {
    statusCounts: Record<TUsersStatus, number>;
    totalTrafficBytes: bigint;
    totalUsers: number;
}

export interface ShortUserStats {
    onlineStats: IUserOnlineStats;
    statusCounts: IUserStats;
}
