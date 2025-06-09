import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { PrometheusReporterModule } from '@integration-modules/prometheus-reporter/prometheus-reporter.module';

import { METRIC_PROVIDERS } from './metrics-providers';
import { ENQUEUE_SERVICES } from './enqueue';
import { JOBS_SERVICES } from './tasks';

@Module({
    imports: [CqrsModule, PrometheusReporterModule],
    providers: [...ENQUEUE_SERVICES, ...JOBS_SERVICES, ...METRIC_PROVIDERS],
})
export class SchedulerModule {
}
