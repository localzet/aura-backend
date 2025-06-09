import { BaseInboundEntity } from '../entities/base-inbound.entity';

export class GetBaseInboundsResponseModel {
    public uuid: string;
    public tag: string;
    public type: string;
    public port: number;
    public network: string | null;
    public security: string | null;

    constructor(inboundsEntity: BaseInboundEntity) {
        this.uuid = inboundsEntity.uuid;
        this.tag = inboundsEntity.tag;
        this.type = inboundsEntity.type;
        this.network = inboundsEntity.network;
        this.security = inboundsEntity.security;

        this.port = inboundsEntity.port;
    }
}
