export interface InboundStatsRaw {
    uuid: string;
    tag: string;
    type: string;
    network: string | null;
    security: string | null;
    enabledUsers: string | number | bigint;
    disabledUsers: string | number | bigint;
    enabledNodes: string | number | bigint;
    disabledNodes: string | number | bigint;
}

export class InboundWithStatsEntity {
    public uuid: string;
    public tag: string;
    public type: string;
    public network: string | null;
    public security: string | null;

    public users: {
        enabled: number;
        disabled: number;
    };

    public nodes: {
        enabled: number;
        disabled: number;
    };

    constructor(data: InboundStatsRaw) {
        this.uuid = data.uuid;
        this.tag = data.tag;
        this.type = data.type;
        this.network = data.network;
        this.security = data.security;

        this.users = {
            enabled: Number(data.enabledUsers),
            disabled: Number(data.disabledUsers),
        };

        this.nodes = {
            enabled: Number(data.enabledNodes),
            disabled: Number(data.disabledNodes),
        };
    }
}
