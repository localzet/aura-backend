import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { XRayConfig } from '@common/helpers/xray-config';

import { GetValidatedConfigQuery } from './get-validated-config.query';
import { XrayConfigService } from '../../xray-config.service';

@QueryHandler(GetValidatedConfigQuery)
export class GetValidatedConfigHandler
    implements IQueryHandler<GetValidatedConfigQuery, null | XRayConfig> {
    private readonly logger = new Logger(GetValidatedConfigHandler.name);

    constructor(private readonly xrayService: XrayConfigService) {
    }

    async execute(): Promise<null | XRayConfig> {
        try {
            const config = await this.xrayService.getConfigInstance();

            return config;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
