import { z } from 'zod';

export const InboundsSchema = z.object({
    uuid: z.string().uuid(),
    tag: z.string(),
    type: z.string(),
    network: z.nullable(z.string()),
    security: z.nullable(z.string()),
});
