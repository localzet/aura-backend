import { ERRORS } from '@localzet/aura-backend-contract/constants';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { ActiveUserInboundsRepository } from '@modules/inbounds/repositories/active-user-inbounds.repository';

import { RemoveInboundsFromUsersByUuidsCommand } from './remove-inbounds-from-users-by-uuids.command';

@CommandHandler(RemoveInboundsFromUsersByUuidsCommand)
export class RemoveInboundsFromUsersByUuidsHandler
    implements ICommandHandler<RemoveInboundsFromUsersByUuidsCommand, ICommandResponse<void>> {
    public readonly logger = new Logger(RemoveInboundsFromUsersByUuidsHandler.name);

    constructor(private readonly activeUserInboundsRepository: ActiveUserInboundsRepository) {
    }

    @Transactional()
    async execute(command: RemoveInboundsFromUsersByUuidsCommand): Promise<ICommandResponse<void>> {
        try {
            await this.activeUserInboundsRepository.removeInboundsFromUsersByUuids(
                command.userUuids,
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
