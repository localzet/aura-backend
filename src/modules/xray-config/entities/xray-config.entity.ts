import { XrayConfig } from '@prisma/client';

export class XrayConfigEntity implements XrayConfig {
    uuid: string;
    config: null | object;
    updatedAt: Date;

    constructor(config: Partial<XrayConfig>) {
        Object.assign(this, config);
        return this;
    }
}
