import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@libs/contracts/constants';

import { InboundsRepository } from '../../repositories/inbounds.repository';
import { InboundsEntity } from '../../entities/inbounds.entity';
import { GetAllInboundsQuery } from './get-all-inbounds.query';

@QueryHandler(GetAllInboundsQuery)
export class GetAllInboundsHandler
    implements IQueryHandler<GetAllInboundsQuery, ICommandResponse<InboundsEntity[]>> {
    private readonly logger = new Logger(GetAllInboundsHandler.name);

    constructor(private readonly inboundsRepository: InboundsRepository) {
    }

    @Transactional()
    async execute(): Promise<ICommandResponse<InboundsEntity[]>> {
        try {
            const inbounds = await this.inboundsRepository.findAll();
            return {
                isOk: true,
                response: inbounds,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
