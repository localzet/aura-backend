import { z } from 'zod';

export const HappSchema = z.object({
    cryptoLink: z.string(),
});
