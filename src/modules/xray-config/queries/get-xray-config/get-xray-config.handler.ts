import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { XrayConfigEntity } from '@modules/xray-config/entities/xray-config.entity';

import { XrayConfigRepository } from '../../repositories/xray-config.repository';
import { GetXrayConfigQuery } from './get-xray-config.query';

@QueryHandler(GetXrayConfigQuery)
export class GetXrayConfigHandler implements IQueryHandler<GetXrayConfigQuery, XrayConfigEntity> {
    private readonly logger = new Logger(GetXrayConfigHandler.name);

    constructor(private readonly xrayConfigRepository: XrayConfigRepository) {
    }

    async execute(): Promise<XrayConfigEntity> {
        try {
            const config = await this.xrayConfigRepository.findFirst();

            if (!config || !config.config) {
                throw new Error('No XRay config found in DB!');
            }

            return config;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
