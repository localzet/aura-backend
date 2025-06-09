import { z } from 'zod';

export const FullInboundsSchema = z.object({
    uuid: z.string().uuid(),
    tag: z.string(),
    type: z.string(),
    port: z.number(),
    network: z.string().nullable(),
    security: z.string().nullable(),
    rawFromConfig: z.object({}).passthrough(),
    users: z.object({
        enabled: z.number(),
        disabled: z.number(),
    }),
    nodes: z.object({
        enabled: z.number(),
        disabled: z.number(),
    }),
});
