import semver from 'semver';

import { Injectable } from '@nestjs/common';

import { SubscriptionTemplateService } from '@modules/subscription-template/subscription-template.service';

import { IFormattedHost } from './interfaces';

interface OutboundConfig {
    flow?: string;
    method?: string;
    multiplex?: any;
    network?: string;
    outbounds?: string[];
    password?: string;
    server: string;
    server_port: number;
    tag: string;
    tls?: any;
    transport?: any;
    type: string;
    uuid?: string;
    headers?: Record<string, unknown>;
    path?: string;
    max_early_data?: number;
    early_data_header_name?: string;
}

interface TlsConfig {
    alpn?: string[];
    enabled?: boolean;
    insecure?: boolean;
    reality?: {
        enabled: boolean;
        public_key?: string;
        short_id?: string;
    };
    server_name?: string;
    utls?: {
        enabled: boolean;
        fingerprint: string;
    };
}

interface TransportConfig {
    early_data_header_name?: string;
    headers?: Record<string, any>;
    host?: string | string[];
    max_early_data?: number;
    path?: string;
    service_name?: string;
    type: string;
}

@Injectable()
export class SingBoxGeneratorService {
    constructor(private readonly subscriptionTemplateService: SubscriptionTemplateService) {}

    public async generateConfig(hosts: IFormattedHost[], version: null | string): Promise<string> {
        try {
            const config = await this.createConfig(version);
            const proxy_remarks: string[] = [];

            for (const host of hosts) {
                if (!host) {
                    continue;
                }

                this.addHost(host, config, proxy_remarks);
            }

            return this.renderConfig(config);
        } catch {
            return '';
        }
    }

    private async createConfig(version: null | string): Promise<Record<string, any>> {
        let config: Record<string, any> = {};

        if (version && semver.gte(version, '1.11.0')) {
            const templateContent =
                await this.subscriptionTemplateService.getJsonTemplateByType('SINGBOX');
            config = templateContent;
        } else {
            const templateContent =
                await this.subscriptionTemplateService.getJsonTemplateByType('SINGBOX_LEGACY');
            config = templateContent;
        }

        if (version && semver.satisfies(version, '>=1.10.0')) {
            // version 1.10.x
            // Reference: https://sing-box.sagernet.org/migration/#tun-address-fields-are-merged
            const tunInboundIndex = config.inbounds.findIndex(
                (inbound: any) => inbound.type === 'tun',
            );

            if (tunInboundIndex !== -1) {
                const tunInbound = config.inbounds[tunInboundIndex];

                if (tunInbound.inet4_address || tunInbound.inet6_address) {
                    tunInbound.address = [
                        tunInbound.inet4_address,
                        tunInbound.inet6_address,
                    ].filter(Boolean);
                    delete tunInbound.inet4_address;
                    delete tunInbound.inet6_address;
                }

                if (tunInbound.inet4_route_address || tunInbound.inet6_route_address) {
                    tunInbound.route_address = [
                        ...(tunInbound.inet4_route_address || []),
                        ...(tunInbound.inet6_route_address || []),
                    ];
                    delete tunInbound.inet4_route_address;
                    delete tunInbound.inet6_route_address;
                }

                if (
                    tunInbound.inet4_route_exclude_address ||
                    tunInbound.inet6_route_exclude_address
                ) {
                    tunInbound.route_exclude_address = [
                        ...(tunInbound.inet4_route_exclude_address || []),
                        ...(tunInbound.inet6_route_exclude_address || []),
                    ];
                    delete tunInbound.inet4_route_exclude_address;
                    delete tunInbound.inet6_route_exclude_address;
                }

                config.inbounds[tunInboundIndex] = tunInbound;
            }
        }

        return config;
    }

    private addOutbound(config: Record<string, any>, outbound_data: OutboundConfig): void {
        config.outbounds.push(outbound_data);
    }

    private renderConfig(config: Record<string, any>): string {
        const urltest_types = ['vless', 'trojan', 'shadowsocks'];
        const urltest_tags = config.outbounds
            .filter((outbound: OutboundConfig) => urltest_types.includes(outbound.type))
            .map((outbound: OutboundConfig) => outbound.tag);

        const selector_types = [...urltest_types, 'urltest'];
        const selector_tags = config.outbounds
            .filter((outbound: OutboundConfig) => selector_types.includes(outbound.type))
            .map((outbound: OutboundConfig) => outbound.tag);

        config.outbounds.forEach((outbound: OutboundConfig) => {
            if (outbound.type === 'urltest') {
                outbound.outbounds = urltest_tags;
            }
            if (outbound.type === 'selector') {
                outbound.outbounds = selector_tags;
            }
        });

        return JSON.stringify(config, null, 4);
    }

    private tlsConfig(
        sni?: string,
        fp?: string,
        tls?: string,
        pbk?: string,
        sid?: string,
        alpn?: string | string[],
    ): TlsConfig {
        const config: TlsConfig = {};

        if (tls === 'tls' || tls === 'reality') {
            config.enabled = true;
        }

        if (sni) {
            config.server_name = sni;
        }

        if (tls === 'reality') {
            config.reality = { enabled: true };
            if (pbk) {
                config.reality.public_key = pbk;
            }
            if (sid) {
                config.reality.short_id = sid;
            }
        }

        if (fp) {
            config.utls = {
                enabled: Boolean(fp),
                fingerprint: fp,
            };
        }

        if (!fp && tls === 'reality') {
            config.utls = {
                enabled: true,
                fingerprint: 'chrome',
            };
        }

        if (alpn) {
            if (typeof alpn === 'string' && alpn.includes(',')) {
                config.alpn = alpn.split(',').map((a) => a.trim());
            } else {
                config.alpn = Array.isArray(alpn) ? alpn : [alpn];
            }
        }

        return config;
    }

    private wsConfig(
        settings: Record<string, any> | undefined,
        host = '',
        path = '',
        max_early_data?: number,
        early_data_header_name?: string,
    ): TransportConfig {
        const config = structuredClone(settings?.wsSettings || { headers: {} });

        if (!config.headers) {
            config.headers = {};
        }

        if (path) {
            config.path = path;
        }
        if (host) {
            config.headers.Host = host;
        }

        if (max_early_data !== undefined) {
            config.max_early_data = max_early_data;
        }
        if (early_data_header_name) {
            config.early_data_header_name = early_data_header_name;
        }

        return config;
    }

    private httpUpgradeConfig(
        settings: Record<string, any> | undefined,
        host = '',
        path = '',
    ): TransportConfig {
        const config = structuredClone(settings?.httpupgradeSettings || { headers: {} });

        if (!config.headers) {
            config.headers = {};
        }

        if (path) {
            config.path = path;
        }
        if (host) {
            config.headers.Host = host;
        }

        return config;
    }

    private transportConfig(
        settings: Record<string, any> | undefined,
        transport_type = '',
        host = '',
        path = '',
        max_early_data?: number,
        early_data_header_name?: string,
    ): TransportConfig {
        let transport_config: TransportConfig = { type: transport_type };

        if (transport_type) {
            switch (transport_type) {
                case 'ws':
                    transport_config = this.wsConfig(
                        settings,
                        host,
                        path,
                        max_early_data,
                        early_data_header_name,
                    );
                    break;
                case 'httpupgrade':
                    transport_config = this.httpUpgradeConfig(settings, host, path);
                    break;
            }
        }

        transport_config.type = transport_type;
        return transport_config;
    }

    private makeOutbound(params: IFormattedHost, settings?: Record<string, any>): OutboundConfig {
        const config: OutboundConfig = {
            type: params.protocol,
            tag: params.remark,
            server: params.address,
            server_port: params.port,
        };

        if (
            ['raw', 'tcp'].includes(params.network) &&
            params.headerType !== 'http' &&
            ['reality', 'tls'].includes(params.tls) &&
            params.protocol === 'vless'
        ) {
            config.flow = 'xtls-rprx-vision';
        }

        if (params.protocol === 'shadowsocks') {
            config.network = 'tcp';
        }

        if (['httpupgrade', 'ws'].includes(params.network)) {
            let max_early_data: number | undefined;
            let early_data_header_name: string | undefined;

            if (params.path.includes('?ed=')) {
                const [pathPart, edPart] = params.path.split('?ed=');
                params.path = pathPart;
                [max_early_data] = edPart.split('/').map(Number);
                early_data_header_name = 'Sec-WebSocket-Protocol';
            }

            config.transport = this.transportConfig(
                settings,
                params.network,
                params.host,
                params.path,
                max_early_data,
                early_data_header_name,
            );
        }

        if (['reality', 'tls'].includes(params.tls)) {
            config.tls = this.tlsConfig(
                params.sni,
                params.fingerprint,
                params.tls,
                params.publicKey,
                params.shortId,
                params.alpn,
            );
        }
        return config;
    }

    private addHost(
        host: IFormattedHost,
        config: Record<string, any>,
        proxy_remarks: string[],
    ): void {
        try {
            if (host.network === 'xhttp') {
                return;
            }

            const remark = host.remark;
            proxy_remarks.push(remark);

            const outbound = this.makeOutbound(host);

            switch (host.protocol) {
                case 'vless':
                    outbound.uuid = host.password.vlessPassword;
                    break;
                case 'trojan':
                    outbound.password = host.password.trojanPassword;
                    break;
                case 'shadowsocks':
                    outbound.password = host.password.ssPassword;
                    outbound.method = 'chacha20-ietf-poly1305';
                    break;
            }

            this.addOutbound(config, outbound);
        } catch {
            // silence error
        }
    }
}
