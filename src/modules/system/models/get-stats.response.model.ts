import { TUsersStatus } from '@localzet/aura-contract/constants';

interface IGetStatsResponseData {
    cpu: {
        cores: number;
        physicalCores: number;
    };
    memory: {
        active: number;
        available: number;
        free: number;
        total: number;
        used: number;
    };
    onlineStats: {
        lastDay: number;
        lastWeek: number;
        neverOnline: number;
        onlineNow: number;
    };
    timestamp: number;
    uptime: number;
    users: {
        statusCounts: Record<TUsersStatus, number>;
        totalTrafficBytes: bigint;
        totalUsers: number;
    };
}

export class GetStatsResponseModel {
    cpu: {
        cores: number;
        physicalCores: number;
    };
    memory: {
        active: number;
        available: number;
        free: number;
        total: number;
        used: number;
    };
    uptime: number;
    timestamp: number;
    users: {
        statusCounts: Record<TUsersStatus, number>;
        totalTrafficBytes: string;
        totalUsers: number;
    };
    onlineStats: {
        lastDay: number;
        lastWeek: number;
        neverOnline: number;
        onlineNow: number;
    };

    constructor(data: IGetStatsResponseData) {
        this.cpu = data.cpu;
        this.memory = data.memory;
        this.uptime = data.uptime;
        this.timestamp = data.timestamp;
        this.users = {
            ...data.users,
            totalTrafficBytes: data.users.totalTrafficBytes.toString(),
        };
        this.onlineStats = data.onlineStats;
    }
}
