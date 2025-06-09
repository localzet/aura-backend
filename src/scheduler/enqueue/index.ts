import { RecordNodesUsageTask } from './record-nodes-usage/record-nodes-usage.task';
import { NodeHealthCheckTask } from './node-health-check/node-health-check.task';
import { RecordUserUsageTask } from './record-user-usage/record-user-usage.task';
import { RESET_USER_TRAFFIC_TASKS } from './reset-user-traffic-jobs';
import { USERS_JOBS_TASKS } from './users-jobs';

export const ENQUEUE_SERVICES = [
    RecordUserUsageTask,
    RecordNodesUsageTask,
    NodeHealthCheckTask,
    ...RESET_USER_TRAFFIC_TASKS,
    ...USERS_JOBS_TASKS,
];
