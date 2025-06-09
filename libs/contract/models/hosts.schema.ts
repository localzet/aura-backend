import { z } from 'zod';

import { SECURITY_LAYERS } from '../constants/hosts';

export const HostsSchema = z.object({
    uuid: z.string().uuid(),
    inboundUuid: z.string().uuid(),
    viewPosition: z.number().int(),
    remark: z.string(),
    address: z.string(),
    port: z.number().int(),
    path: z.string().nullable(),
    sni: z.string().nullable(),
    host: z.string().nullable(),
    alpn: z.string().nullable(),
    fingerprint: z.string().nullable(),
    allowInsecure: z.boolean().default(false),
    isDisabled: z.boolean().default(false),
    securityLayer: z.nativeEnum(SECURITY_LAYERS).default(SECURITY_LAYERS.DEFAULT),
    xHttpExtraParams: z.nullable(z.unknown()),
});
