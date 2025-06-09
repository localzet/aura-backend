import { z } from 'zod';

export const ApiTokensSchema = z.object({
    uuid: z.string().uuid(),
    token: z.string(),
    tokenName: z.string(),
    tokenDescription: z.nullable(z.string()),

    createdAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    updatedAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
});
