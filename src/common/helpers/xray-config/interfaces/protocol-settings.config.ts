// Shadowsocks Protocol Settings
export interface ShadowsocksSettings {
    clients: ShadowsocksUser[];
}

export interface ShadowsocksUser extends UserObject {
    method: string;
    password: string;
}

export interface TrojanFallback {
    alpn?: string;
    dest?: number | string;
    path?: string;
    xver?: number;
}

// Trojan Protocol Settings
export interface TrojanSettings {
    clients: TrojanUser[];
    fallbacks?: TrojanFallback[];
}

export interface TrojanUser extends UserObject {
    flow?: string;
    password: string;
}

// Common interfaces
export interface UserObject {
    email?: string;
    level?: number;
}

export interface VLessFallback {
    alpn?: string;
    dest?: number | string;
    path?: string;
    xver?: number;
}

// VLess Protocol Settings
export interface VLessSettings {
    clients: VLessUser[];
    decryption: 'none';
    fallbacks?: VLessFallback[];
}

export interface VLessUser extends UserObject {
    encryption?: string;
    flow?: 'xtls-rprx-vision' | '';
    id: string;
}
