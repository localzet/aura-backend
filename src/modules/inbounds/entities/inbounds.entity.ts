import { Inbounds } from '@prisma/client';

export class InboundsEntity implements Inbounds {
    public uuid: string;
    public tag: string;
    public type: string;
    public network: string | null;
    public security: string | null;

    constructor(inbound: Partial<Inbounds>) {
        Object.assign(this, inbound);
        return this;
    }
}
