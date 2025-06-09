import { ShadowsocksSettings, TrojanSettings, VLessSettings } from './protocol-settings.config';
import { StreamSettingsObject } from './transport.config';
import { FallbackObject } from './routing.config';

export interface InboundObject {
    allocate?: unknown;
    listen?: string;
    port: number | string;
    protocol: 'shadowsocks' | 'trojan' | 'vless';
    settings?: InboundSettings;
    sniffing?: unknown;
    streamSettings?: StreamSettingsObject;
    tag: string;
}

export type InboundSettings = ShadowsocksSettings | TrojanSettings | VLessSettings;

export interface ShadowsocksInboundSettings {
    email?: string;
    level?: number;
    method: string;
    network?: string;
    password: string;
    uot?: boolean;
    UoTVersion?: number;
}

export interface VLessClientObject {
    email?: string;
    flow?: string;
    id: string;
    level?: number;
}

export interface VLessInboundSettings {
    clients: VLessClientObject[];
    decryption: 'none';
    fallbacks?: FallbackObject[];
}
