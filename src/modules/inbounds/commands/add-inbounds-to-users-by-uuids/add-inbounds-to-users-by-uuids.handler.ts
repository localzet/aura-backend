import { ERRORS } from '@localzet/aura-contract/constants';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { ActiveUserInboundsRepository } from '@modules/inbounds/repositories/active-user-inbounds.repository';

import { AddInboundsToUsersByUuidsCommand } from './add-inbounds-to-users-by-uuids.command';

@CommandHandler(AddInboundsToUsersByUuidsCommand)
export class AddInboundsToUsersByUuidsHandler
    implements ICommandHandler<AddInboundsToUsersByUuidsCommand, ICommandResponse<void>> {
    public readonly logger = new Logger(AddInboundsToUsersByUuidsHandler.name);

    constructor(private readonly activeUserInboundsRepository: ActiveUserInboundsRepository) {
    }

    @Transactional()
    async execute(command: AddInboundsToUsersByUuidsCommand): Promise<ICommandResponse<void>> {
        try {
            await this.activeUserInboundsRepository.addInboundsToUsersByUuids(
                command.userUuids,
                command.inboundUuids,
            );
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
