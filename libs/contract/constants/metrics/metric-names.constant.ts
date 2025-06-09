export const METRIC_NAMES = {
    NODE_ONLINE_USERS: 'node_online_users',
    NODE_STATUS: 'node_status',
    USERS_STATUS: 'users_status',
    USERS_TOTAL: 'users_total',
} as const;

export type TMetricNames = typeof METRIC_NAMES;
export type TMetricNamesKeys = (typeof METRIC_NAMES)[keyof typeof METRIC_NAMES];
