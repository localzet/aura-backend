import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Response } from 'express';

import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';

import { METRICS_ROOT } from '@localzet/aura-contract';

import { BasicAuthGuard } from './guards/basic-auth.guard';

@ApiBasicAuth('Prometheus')
@ApiTags('Prometheus')
@Controller(METRICS_ROOT)
export class PrometheusReporterController extends PrometheusController {
    constructor() {
        super();
    }

    @ApiOperation({ summary: 'Prometheus Metrics' })
    @UseGuards(BasicAuthGuard)
    @Get()
    async index(@Res({ passthrough: true }) response: Response) {
        return super.index(response);
    }
}
