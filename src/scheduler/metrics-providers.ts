import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

import { METRIC_NAMES } from '@libs/contracts/constants';

export const METRIC_PROVIDERS = [
    makeGaugeProvider({
        name: METRIC_NAMES.NODE_ONLINE_USERS,
        help: 'Number of online users on a node',
        labelNames: ['node_uuid', 'node_name', 'node_country_emoji'],
    }),
    makeGaugeProvider({
        name: METRIC_NAMES.NODE_STATUS,
        help: 'Node connection status (1 - connected, 0 - disconnected)',
        labelNames: ['node_uuid', 'node_name', 'node_country_emoji'],
    }),
    makeGaugeProvider({
        name: METRIC_NAMES.USERS_STATUS,
        help: 'Counter for users statuses, updated every 1 minute',
        labelNames: ['status'],
    }),
    makeGaugeProvider({
        name: METRIC_NAMES.USERS_TOTAL,
        help: 'Total number of users, updated every 1 minute',
        labelNames: ['type'],
    }),
];
