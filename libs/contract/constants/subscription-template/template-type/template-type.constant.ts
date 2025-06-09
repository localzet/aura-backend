export const SUBSCRIPTION_TEMPLATE_TYPE = {
    STASH: 'STASH',
    SINGBOX: 'SINGBOX',
    SINGBOX_LEGACY: 'SINGBOX_LEGACY',
    MIHOMO: 'MIHOMO',
    XRAY_JSON: 'XRAY_JSON',
    CLASH: 'CLASH',
} as const;

export type TSubscriptionTemplateType = [keyof typeof SUBSCRIPTION_TEMPLATE_TYPE][number];
export const SUBSCRIPTION_TEMPLATE_TYPE_VALUES = Object.values(SUBSCRIPTION_TEMPLATE_TYPE);
