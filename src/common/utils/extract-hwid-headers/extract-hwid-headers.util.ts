import { Request } from 'express';

export interface HwidHeaders {
    hwid: string;
    platform?: string;
    osVersion?: string;
    deviceModel?: string;
    userAgent?: string;
}

export function extractHwidHeaders(request: Request): HwidHeaders | null {
    const hwid = request.headers['x-hwid'] as string | undefined;

    if (!hwid) {
        return null;
    }

    return {
        hwid,
        platform: request.headers['x-device-os'] as string | undefined,
        osVersion: request.headers['x-ver-os'] as string | undefined,
        deviceModel: request.headers['x-device-model'] as string | undefined,
        userAgent: request.headers['user-agent'] as string | undefined,
    };
}
