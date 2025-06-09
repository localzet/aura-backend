import { InboundWithStatsEntity } from '../entities';

export class GetFullInboundsResponseModel {
    public uuid: string;
    public tag: string;
    public type: string;
    public port: number;
    public network: string | null;
    public security: string | null;
    public rawFromConfig: Record<string, unknown>;
    public users: {
        enabled: number;
        disabled: number;
    };
    public nodes: {
        enabled: number;
        disabled: number;
    };

    constructor(
        inboundsEntity: InboundWithStatsEntity,
        rawFromConfig: Record<string, unknown>,
        port: number,
    ) {
        this.tag = inboundsEntity.tag;
        this.uuid = inboundsEntity.uuid;
        this.type = inboundsEntity.type;
        this.port = port;
        this.network = inboundsEntity.network;
        this.security = inboundsEntity.security;
        this.rawFromConfig = rawFromConfig;
        this.users = inboundsEntity.users;
        this.nodes = inboundsEntity.nodes;
    }
}
