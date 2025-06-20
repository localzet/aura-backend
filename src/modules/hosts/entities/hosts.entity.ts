import { Hosts } from '@prisma/client';

import { TSecurityLayers } from '@localzet/aura-contract/constants';

export class HostsEntity implements Hosts {
    uuid: string;
    inboundUuid: string;
    viewPosition: number;
    remark: string;
    address: string;
    port: number;
    path: null | string;
    sni: null | string;
    host: null | string;
    alpn: null | string;
    fingerprint: null | string;
    securityLayer: TSecurityLayers;
    allowInsecure: boolean;
    xHttpExtraParams: null | object;
    isDisabled: boolean;

    constructor(data: Partial<Hosts>) {
        Object.assign(this, data);
    }
}
