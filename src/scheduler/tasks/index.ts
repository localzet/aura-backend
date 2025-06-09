import { ResetNodeTrafficTask } from './reset-node-traffic/reset-node-traffic.service';
import { ExportMetricsTask } from './export-metrics/export-metrics.task';
import { ReviewNodesTask } from './review-nodes/review-nodes.task';

export const JOBS_SERVICES = [ResetNodeTrafficTask, ReviewNodesTask, ExportMetricsTask];
