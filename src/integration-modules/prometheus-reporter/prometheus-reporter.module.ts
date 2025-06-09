import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { PrometheusReporterController } from './prometheus-reporter.controller';
import { BasicStrategy } from './strategies';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        PrometheusModule.registerAsync({
            inject: [],
            controller: PrometheusReporterController,
            useFactory: () => ({
                defaultLabels: {
                    app: 'aura',
                },
                customMetricPrefix: 'aura',
            }),
        }),
    ],
    controllers: [],
    providers: [BasicStrategy],
    exports: [PrometheusModule],
})
export class PrometheusReporterModule {
}
