import { InboundsEntity } from './inbounds.entity';

export class BaseInboundEntity extends InboundsEntity {
    public port: number;

    constructor(entity: InboundsEntity, port: number) {
        super(entity);
        this.port = port;
    }
}
