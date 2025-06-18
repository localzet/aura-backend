import { ERRORS } from '@localzet/aura-backend-contract/constants';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { InboundsRepository } from '../../repositories/inbounds.repository';
import { UpdateInboundCommand } from './update-inbound.command';

@CommandHandler(UpdateInboundCommand)
export class UpdateInboundHandler
    implements ICommandHandler<UpdateInboundCommand, ICommandResponse<void>> {
    public readonly logger = new Logger(UpdateInboundHandler.name);

    constructor(private readonly inboundsRepository: InboundsRepository) {
    }

    @Transactional()
    async execute(command: UpdateInboundCommand): Promise<ICommandResponse<void>> {
        try {
            await this.inboundsRepository.update(command.inbound);
            return {
                isOk: true,
            };
        } catch (error: unknown) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.UPDATE_INBOUND_ERROR,
            };
        }
    }
}
