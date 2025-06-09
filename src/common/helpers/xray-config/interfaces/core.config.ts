import { InboundObject } from './protocols.config';

export interface IXrayConfig {
    api?: unknown;
    dns?: unknown;
    fakedns?: unknown;
    inbounds: InboundObject[];
    log?: unknown;
    outbounds: unknown;
    policy?: unknown;
    reverse?: unknown;
    routing?: unknown;
    stats?: unknown;
}
