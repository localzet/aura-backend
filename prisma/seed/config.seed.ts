import { generateJwtKeypair, generateMasterCerts } from '@common/utils/certs/generate-certs.util';
import {
    SUBSCRIPTION_TEMPLATE_TYPE,
    SUBSCRIPTION_TEMPLATE_TYPE_VALUES,
} from '@libs/contracts/constants';
import { KeygenEntity } from '@modules/keygen/entities/keygen.entity';
import { PrismaClient } from '@prisma/client';
import consola from 'consola';

export const XTLSDefaultConfig = {
    log: {
        loglevel: 'info',
    },
    inbounds: [
        {
            tag: 'Shadowsocks',
            port: 1234,
            protocol: 'shadowsocks',
            settings: {
                clients: [],
                network: 'tcp,udp',
            },
            sniffing: {
                enabled: true,
                destOverride: ['http', 'tls', 'quic'],
            },
        },
    ],
    outbounds: [
        {
            protocol: 'freedom',
            tag: 'DIRECT',
        },
        {
            protocol: 'blackhole',
            tag: 'BLOCK',
        },
    ],
    routing: {
        rules: [
            {
                ip: ['geoip:private'],
                outboundTag: 'BLOCK',
                type: 'field',
            },
            {
                domain: ['geosite:private'],
                outboundTag: 'BLOCK',
                type: 'field',
            },
            {
                protocol: ['bittorrent'],
                outboundTag: 'BLOCK',
                type: 'field',
            },
        ],
    },
};

export const MihomoDefaultConfig = `mixed-port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: global
log-level: info
external-controller: 127.0.0.1:9090
dns:
  enable: true
  use-hosts: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  default-nameserver:
    - 1.1.1.1
    - 8.8.8.8
  nameserver:
    - 1.1.1.1
    - 8.8.8.8
  fake-ip-filter:
    - '*.lan'
    - stun.*.*.*
    - stun.*.*
    - time.windows.com
    - time.nist.gov
    - time.apple.com
    - time.asia.apple.com
    - '*.openwrt.pool.ntp.org'
    - pool.ntp.org
    - ntp.ubuntu.com
    - time1.apple.com
    - time2.apple.com
    - time3.apple.com
    - time4.apple.com
    - time5.apple.com
    - time6.apple.com
    - time7.apple.com
    - time1.google.com
    - time2.google.com
    - time3.google.com
    - time4.google.com
    - api.joox.com
    - joox.com
    - '*.xiami.com'
    - '*.msftconnecttest.com'
    - '*.msftncsi.com'
    - '+.xboxlive.com'
    - '*.*.stun.playstation.net'
    - xbox.*.*.microsoft.com
    - '*.ipv6.microsoft.com'
    - speedtest.cros.wr.pvp.net

proxies: # LEAVE THIS LINE!

proxy-groups:
  - name: '→ Aura'
    type: 'select'
    proxies: # LEAVE THIS LINE!

rules:
  - MATCH,→ Aura
`;

export const StashDefaultConfig = `proxy-groups:
  - name: → Aura
    type: select
    proxies: # LEAVE THIS LINE!

proxies: # LEAVE THIS LINE!

rules:
  - SCRIPT,quic,REJECT
  - DOMAIN-SUFFIX,iphone-ld.apple.com,DIRECT
  - DOMAIN-SUFFIX,lcdn-locator.apple.com,DIRECT
  - DOMAIN-SUFFIX,lcdn-registration.apple.com,DIRECT
  - DOMAIN-SUFFIX,push.apple.com,DIRECT
  - PROCESS-NAME,v2ray,DIRECT
  - PROCESS-NAME,Surge,DIRECT
  - PROCESS-NAME,ss-local,DIRECT
  - PROCESS-NAME,privoxy,DIRECT
  - PROCESS-NAME,trojan,DIRECT
  - PROCESS-NAME,trojan-go,DIRECT
  - PROCESS-NAME,naive,DIRECT
  - PROCESS-NAME,CloudflareWARP,DIRECT
  - PROCESS-NAME,Cloudflare WARP,DIRECT
  - IP-CIDR,162.159.193.0/24,DIRECT,no-resolve
  - PROCESS-NAME,p4pclient,DIRECT
  - PROCESS-NAME,Thunder,DIRECT
  - PROCESS-NAME,DownloadService,DIRECT
  - PROCESS-NAME,qbittorrent,DIRECT
  - PROCESS-NAME,Transmission,DIRECT
  - PROCESS-NAME,fdm,DIRECT
  - PROCESS-NAME,aria2c,DIRECT
  - PROCESS-NAME,Folx,DIRECT
  - PROCESS-NAME,NetTransport,DIRECT
  - PROCESS-NAME,uTorrent,DIRECT
  - PROCESS-NAME,WebTorrent,DIRECT
  - GEOIP,LAN,DIRECT
  - MATCH,→ Aura
script:
  shortcuts:
    quic: network == 'udp' and dst_port == 443
dns:
  default-nameserver:
    - 1.1.1.1
    - 1.0.0.1
  nameserver:
    - 1.1.1.1
    - 1.0.0.1
log-level: warning
mode: rule

`;

export const ClashDefaultConfig = `mixed-port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: global
log-level: info
external-controller: 127.0.0.1:9090
dns:
  enable: true
  use-hosts: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  default-nameserver:
    - 1.1.1.1
    - 8.8.8.8
  nameserver:
    - 1.1.1.1
    - 8.8.8.8
  fake-ip-filter:
    - '*.lan'
    - stun.*.*.*
    - stun.*.*
    - time.windows.com
    - time.nist.gov
    - time.apple.com
    - time.asia.apple.com
    - '*.openwrt.pool.ntp.org'
    - pool.ntp.org
    - ntp.ubuntu.com
    - time1.apple.com
    - time2.apple.com
    - time3.apple.com
    - time4.apple.com
    - time5.apple.com
    - time6.apple.com
    - time7.apple.com
    - time1.google.com
    - time2.google.com
    - time3.google.com
    - time4.google.com
    - api.joox.com
    - joox.com
    - '*.xiami.com'
    - '*.msftconnecttest.com'
    - '*.msftncsi.com'
    - '+.xboxlive.com'
    - '*.*.stun.playstation.net'
    - xbox.*.*.microsoft.com
    - '*.ipv6.microsoft.com'
    - speedtest.cros.wr.pvp.net

proxies: # LEAVE THIS LINE!

proxy-groups:
  - name: '→ Aura'
    type: 'select'
    proxies: # LEAVE THIS LINE!

rules:
  - MATCH,→ Aura`;

export const SingboxLegacyDefaultConfig = {
    log: {
        disabled: true,
        level: 'debug',
        timestamp: true,
    },
    dns: {
        servers: [
            {
                tag: 'cf-dns',
                address: 'tls://1.1.1.1',
            },
            {
                tag: 'local',
                address: 'tcp://1.1.1.1',
                address_strategy: 'prefer_ipv4',
                strategy: 'ipv4_only',
                detour: 'direct',
            },
            {
                tag: 'remote',
                address: 'fakeip',
            },
        ],
        rules: [
            {
                query_type: ['A', 'AAAA'],
                server: 'remote',
            },
            {
                outbound: 'any',
                server: 'local',
            },
        ],
        fakeip: {
            enabled: true,
            inet4_range: '198.18.0.0/15',
            inet6_range: 'fc00::/18',
        },
        independent_cache: true,
    },
    inbounds: [
        {
            type: 'tun',
            mtu: 9000,
            interface_name: 'tun125',
            tag: 'tun-in',
            inet4_address: '172.19.0.1/30',
            inet6_address: 'fdfe:dcba:9876::1/126',
            auto_route: true,
            strict_route: true,
            endpoint_independent_nat: true,
            stack: 'mixed',
            sniff: true,
            platform: {
                http_proxy: {
                    enabled: true,
                    server: '127.0.0.1',
                    server_port: 2412,
                },
            },
        },
        {
            type: 'mixed',
            tag: 'mixed-in',
            listen: '127.0.0.1',
            listen_port: 2412,
            sniff: true,
            users: [],
            set_system_proxy: false,
        },
    ],
    outbounds: [
        {
            type: 'selector',
            tag: '→ Aura',
            interrupt_exist_connections: true,
            outbounds: null,
        },
        {
            type: 'direct',
            tag: 'direct',
        },
        {
            type: 'block',
            tag: 'block',
        },
        {
            type: 'dns',
            tag: 'dns-out',
        },
    ],
    route: {
        rules: [
            {
                type: 'logical',
                mode: 'or',
                rules: [
                    {
                        protocol: 'dns',
                    },
                    {
                        port: 53,
                    },
                ],
                outbound: 'dns-out',
            },
            {
                ip_is_private: true,
                outbound: 'direct',
            },
        ],
        auto_detect_interface: true,
        override_android_vpn: true,
    },
    experimental: {
        clash_api: {
            external_controller: '127.0.0.1:9090',
            external_ui: 'yacd',
            external_ui_download_url: 'https://github.com/MetaCubeX/Yacd-meta/archive/gh-pages.zip',
            external_ui_download_detour: 'direct',
            default_mode: 'rule',
        },
        cache_file: {
            enabled: true,
            path: 'aura.db',
            cache_id: 'aura',
            store_fakeip: true,
        },
    },
};

export const SingboxDefaultConfig = {
    log: {
        disabled: true,
        level: 'debug',
        timestamp: true,
    },
    dns: {
        servers: [
            {
                tag: 'cf-dns',
                address: 'tls://1.1.1.1',
            },
            {
                tag: 'local',
                address: 'tcp://1.1.1.1',
                address_strategy: 'prefer_ipv4',
                strategy: 'ipv4_only',
                detour: 'direct',
            },
            {
                tag: 'remote',
                address: 'fakeip',
            },
        ],
        rules: [
            {
                query_type: ['A', 'AAAA'],
                server: 'remote',
            },
            {
                outbound: 'any',
                server: 'local',
            },
        ],
        fakeip: {
            enabled: true,
            inet4_range: '198.18.0.0/15',
            inet6_range: 'fc00::/18',
        },
        independent_cache: true,
    },
    inbounds: [
        {
            type: 'tun',
            mtu: 9000,
            interface_name: 'tun125',
            tag: 'tun-in',
            inet4_address: '172.19.0.1/30',
            inet6_address: 'fdfe:dcba:9876::1/126',
            auto_route: true,
            strict_route: true,
            endpoint_independent_nat: true,
            stack: 'mixed',
            sniff: true,
            platform: {
                http_proxy: {
                    enabled: true,
                    server: '127.0.0.1',
                    server_port: 2412,
                },
            },
        },
        {
            type: 'mixed',
            tag: 'mixed-in',
            listen: '127.0.0.1',
            listen_port: 2412,
            sniff: true,
            users: [],
            set_system_proxy: false,
        },
    ],
    outbounds: [
        {
            type: 'selector',
            tag: '→ Aura',
            interrupt_exist_connections: true,
            outbounds: null,
        },
        {
            type: 'direct',
            tag: 'direct',
        },
    ],
    route: {
        rules: [
            {
                action: 'sniff',
            },
            {
                type: 'logical',
                mode: 'or',
                rules: [
                    {
                        protocol: 'dns',
                    },
                    {
                        port: 53,
                    },
                ],
                action: 'hijack-dns',
            },
            {
                ip_is_private: true,
                outbound: 'direct',
            },
        ],
        auto_detect_interface: true,
        override_android_vpn: true,
    },
    experimental: {
        clash_api: {
            external_controller: '127.0.0.1:9090',
            external_ui: 'yacd',
            external_ui_download_url: 'https://github.com/MetaCubeX/Yacd-meta/archive/gh-pages.zip',
            external_ui_download_detour: 'direct',
            default_mode: 'rule',
        },
        cache_file: {
            enabled: true,
            path: 'aura.db',
            cache_id: 'aura',
            store_fakeip: true,
        },
    },
};

export const XrayJsonDefaultConfig = {
    dns: {
        servers: ['1.1.1.1', '1.0.0.1'],
        queryStrategy: 'UseIP',
    },
    routing: {
        rules: [
            {
                type: 'field',
                protocol: ['bittorrent'],
                outboundTag: 'direct',
            },
        ],
        domainMatcher: 'hybrid',
        domainStrategy: 'IPIfNonMatch',
    },
    inbounds: [
        {
            tag: 'socks',
            port: 10808,
            listen: '127.0.0.1',
            protocol: 'socks',
            settings: {
                udp: true,
                auth: 'noauth',
            },
            sniffing: {
                enabled: true,
                routeOnly: false,
                destOverride: ['http', 'tls', 'quic'],
            },
        },
        {
            tag: 'http',
            port: 10809,
            listen: '127.0.0.1',
            protocol: 'http',
            settings: {
                allowTransparent: false,
            },
            sniffing: {
                enabled: true,
                routeOnly: false,
                destOverride: ['http', 'tls', 'quic'],
            },
        },
    ],
    outbounds: [
        {
            tag: 'direct',
            protocol: 'freedom',
        },
        {
            tag: 'block',
            protocol: 'blackhole',
        },
    ],
};

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function seedSubscriptionTemplate() {
    consola.start('Seeding subscription templates...');
    for (const templateType of SUBSCRIPTION_TEMPLATE_TYPE_VALUES) {
        const existingConfig = await prisma.subscriptionTemplate.findUnique({
            where: {
                templateType,
            },
        });

        switch (templateType) {
            case SUBSCRIPTION_TEMPLATE_TYPE.STASH:
                if (existingConfig) {
                    consola.info(`Default ${templateType} config already exists!`);
                    continue;
                }

                await prisma.subscriptionTemplate.create({
                    data: { templateType, templateYaml: StashDefaultConfig },
                });

                break;
            case SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO:
                if (existingConfig) {
                    consola.info(`Default ${templateType} config already exists!`);
                    continue;
                }

                await prisma.subscriptionTemplate.create({
                    data: { templateType, templateYaml: MihomoDefaultConfig },
                });
                break;
            case SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX:
                if (existingConfig) {
                    consola.info(`Default ${templateType} config already exists!`);
                    continue;
                }

                await prisma.subscriptionTemplate.create({
                    data: { templateType, templateJson: SingboxDefaultConfig },
                });
                break;
            case SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX_LEGACY:
                if (existingConfig) {
                    consola.info(`Default ${templateType} config already exists!`);
                    continue;
                }

                await prisma.subscriptionTemplate.create({
                    data: { templateType, templateJson: SingboxLegacyDefaultConfig },
                });
                break;
            case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON:
                if (existingConfig) {
                    consola.info(`Default ${templateType} config already exists!`);
                    continue;
                }

                await prisma.subscriptionTemplate.create({
                    data: { templateType, templateJson: XrayJsonDefaultConfig },
                });

                break;
            case SUBSCRIPTION_TEMPLATE_TYPE.CLASH:
                if (existingConfig) {
                    consola.info(`Default ${templateType} config already exists!`);
                    continue;
                }

                await prisma.subscriptionTemplate.create({
                    data: { templateType, templateYaml: ClashDefaultConfig },
                });

                break;
            default:
                consola.error(`Unknown template type: ${templateType}`);
                process.exit(1);
        }
    }
}

async function seedSubscriptionSettings() {
    const existingConfig = await prisma.subscriptionSettings.findFirst();

    if (existingConfig) {
        consola.info('Default subscription settings already seeded!');
        return;
    }

    const expiredUserRemarks = ['🚨 Subscription expired', 'Contact support'];
    const disabledUserRemarks = ['❌ Subscription disabled', 'Contact support'];
    const limitedUserRemarks = ['🔴 Subscription limited', 'Contact support'];

    await prisma.subscriptionSettings.create({
        data: {
            profileTitle: 'Aura',
            supportLink: 'https://aura.zorin.space',
            profileUpdateInterval: 12,
            isProfileWebpageUrlEnabled: true,
            expiredUsersRemarks: expiredUserRemarks,
            limitedUsersRemarks: limitedUserRemarks,
            disabledUsersRemarks: disabledUserRemarks,
            serveJsonAtBaseSubscription: false,
            addUsernameToBaseSubscription: false,
            isShowCustomRemarks: true,
            randomizeHosts: false,
        },
    });
}

async function seedConfigVariables() {
    const existingConfig = await prisma.xrayConfig.findFirst();

    consola.start('🔐 Seeding XTLS config...');

    if (existingConfig) {
        consola.success('🔐 Default XTLS config already seeded!');
        return;
    }

    const config = await prisma.xrayConfig.create({
        data: {
            config: XTLSDefaultConfig,
        },
    });

    if (!config) {
        consola.error('🔐 Failed to create default config!');
        process.exit(1);
    }

    consola.success('🔐 Default XTLS config seeded!');
}

async function seedKeygen() {
    consola.start('🔐 Seeding keygen...');

    try {
        await prisma.$transaction(
            async (tx) => {
                const count = await tx.keygen.count();
                consola.info(`Keygen count: ${count}`);

                let IsNeedCreateNewKeygen = false;

                if (count > 1) {
                    IsNeedCreateNewKeygen = true;

                    consola.info('Deleting old keygen...');

                    await tx.keygen.deleteMany();
                }

                const existingConfig = await tx.keygen.findFirst({
                    orderBy: { createdAt: 'asc' },
                });

                if (!existingConfig) {
                    IsNeedCreateNewKeygen = true;
                }

                if (IsNeedCreateNewKeygen) {
                    const { publicKey, privateKey } = await generateJwtKeypair();
                    const { caCertPem, caKeyPem, clientCertPem, clientKeyPem } =
                        await generateMasterCerts();

                    const keygenEntity = new KeygenEntity({
                        caCert: caCertPem,
                        caKey: caKeyPem,
                        clientCert: clientCertPem,
                        clientKey: clientKeyPem,
                        pubKey: publicKey,
                        privKey: privateKey,
                    });

                    return await tx.keygen.create({
                        data: keygenEntity,
                    });
                }

                if (
                    existingConfig &&
                    existingConfig.pubKey &&
                    existingConfig.privKey &&
                    (!existingConfig.caCert ||
                        !existingConfig.caKey ||
                        !existingConfig.clientCert ||
                        !existingConfig.clientKey)
                ) {
                    try {
                        const { caCertPem, caKeyPem, clientCertPem, clientKeyPem } =
                            await generateMasterCerts();

                        await tx.keygen.update({
                            where: { uuid: existingConfig.uuid },
                            data: {
                                caCert: caCertPem,
                                caKey: caKeyPem,
                                clientCert: clientCertPem,
                                clientKey: clientKeyPem,
                            },
                        });

                        consola.success('🔐 Keygen updated!');
                        return;
                    } catch (error) {
                        consola.error('🔐 Failed to update keygen:', error);
                        process.exit(1);
                    }
                }

                return;
            },
            {
                timeout: 30000,
                isolationLevel: 'Serializable',
            },
        );

        consola.success('🔐 Keygen seeded!');
        return;
    } catch (error) {
        consola.error('🔐 Failed to seed keygen:', error);
        process.exit(1);
    }
}

async function ensureConfigUnique() {
    const countConfigs = await prisma.xrayConfig.count();
    try {
        consola.info(`XTLS configs count: ${countConfigs}`);
        if (countConfigs > 1) {
            consola.warn('More than one XTLS config found! Deleting all except the first one...');
            const firstConfig = await prisma.xrayConfig.findFirst({
                orderBy: { updatedAt: 'asc' },
            });

            if (firstConfig) {
                await prisma.xrayConfig.deleteMany({
                    where: {
                        uuid: {
                            not: firstConfig.uuid,
                        },
                    },
                });
            }

            consola.success('Successfully deleted all XTLS configs except the first one!');
        }
    } catch (error) {
        consola.error('Failed to ensure config unique:', error);
        process.exit(1);
    }
}

async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        consola.success('Database connected!');
        return true;
    } catch (error) {
        consola.error('Database connection error:', error);
        process.exit(1);
    }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function seedAll() {
    let isConnected = false;

    while (!isConnected) {
        isConnected = await checkDatabaseConnection();

        if (isConnected) {
            consola.start('Database connected. Starting seeding...');
            await seedSubscriptionTemplate();
            await seedConfigVariables();
            await seedSubscriptionSettings();
            await seedKeygen();
            await ensureConfigUnique();
            break;
        } else {
            consola.info('Failed to connect to database. Retrying in 5 seconds...');
            await delay(5_000);
        }
    }
}

seedAll()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        consola.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
