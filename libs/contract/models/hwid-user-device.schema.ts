import { z } from 'zod';

export const HwidUserDeviceSchema = z.object({
    hwid: z.string(),
    userUuid: z.string().uuid(),
    platform: z.nullable(z.string()),
    osVersion: z.nullable(z.string()),
    deviceModel: z.nullable(z.string()),

    userAgent: z.nullable(z.string()),

    createdAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    updatedAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
});
