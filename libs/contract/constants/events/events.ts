export const EVENTS = {
    USER: {
        CREATED: 'user.created',
        MODIFIED: 'user.modified',
        DELETED: 'user.deleted',
        REVOKED: 'user.revoked',
        DISABLED: 'user.disabled',
        ENABLED: 'user.enabled',
        LIMITED: 'user.limited',
        EXPIRED: 'user.expired',
        TRAFFIC_RESET: 'user.traffic_reset',
        EXPIRE_NOTIFY: {
            EXPIRES_IN_72_HOURS: 'user.expires_in_72_hours',
            EXPIRES_IN_48_HOURS: 'user.expires_in_48_hours',
            EXPIRES_IN_24_HOURS: 'user.expires_in_24_hours',
            EXPIRED_24_HOURS_AGO: 'user.expired_24_hours_ago',
        },
        FIRST_CONNECTED: 'user.first_connected',
        BANDWIDTH_USAGE_THRESHOLD_REACHED: 'user.bandwidth_usage_threshold_reached',
    },
    NODE: {
        CREATED: 'node.created',
        MODIFIED: 'node.modified',
        DISABLED: 'node.disabled',
        ENABLED: 'node.enabled',
        DELETED: 'node.deleted',
        CONNECTION_LOST: 'node.connection_lost',
        CONNECTION_RESTORED: 'node.connection_restored',
        TRAFFIC_NOTIFY: 'node.traffic_notify',
    },
    SERVICE: {
        PANEL_STARTED: 'service.panel_started',
        LOGIN_ATTEMPT_FAILED: 'service.login_attempt_failed',
        LOGIN_ATTEMPT_SUCCESS: 'service.login_attempt_success',
    },
    ERRORS: {
        BANDWIDTH_USAGE_THRESHOLD_REACHED_MAX_NOTIFICATIONS:
            'errors.bandwidth_usage_threshold_reached_max_notifications',
    },
    CATCH_ALL_USER_EVENTS: 'user.*',
    CATCH_ALL_NODE_EVENTS: 'node.*',
    CATCH_ALL_SERVICE_EVENTS: 'service.*',
    CATCH_ALL_ERRORS_EVENTS: 'errors.*',
} as const;

export type TNodeEvents = (typeof EVENTS.NODE)[keyof typeof EVENTS.NODE];
export type TUserEvents = (typeof EVENTS.USER)[keyof typeof EVENTS.USER];
export type TServiceEvents = (typeof EVENTS.SERVICE)[keyof typeof EVENTS.SERVICE];
export type TErrorsEvents = (typeof EVENTS.ERRORS)[keyof typeof EVENTS.ERRORS];
