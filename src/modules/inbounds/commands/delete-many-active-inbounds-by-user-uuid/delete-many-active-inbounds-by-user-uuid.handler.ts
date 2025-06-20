import { ActiveUserInboundsRepository } from 'src/modules/inbounds/repositories/active-user-inbounds.repository';
import { ERRORS } from '@localzet/aura-contract/constants';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { DeleteManyActiveInboundsByUserUuidCommand } from './delete-many-active-inbounds-by-user-uuid.command';

@CommandHandler(DeleteManyActiveInboundsByUserUuidCommand)
export class DeleteManyActiveInboundsByUserUuidHandler
    implements ICommandHandler<DeleteManyActiveInboundsByUserUuidCommand, ICommandResponse<number>> {
    public readonly logger = new Logger(DeleteManyActiveInboundsByUserUuidHandler.name);

    constructor(private readonly activeUserInboundsRepository: ActiveUserInboundsRepository) {
    }

    async execute(
        command: DeleteManyActiveInboundsByUserUuidCommand,
    ): Promise<ICommandResponse<number>> {
        try {
            const count = await this.activeUserInboundsRepository.deleteManyActiveByUserUuid(
                command.userUuid,
            );
            return {
                isOk: true,
                response: count,
            };
        } catch (error: unknown) {
            this.logger.error(`Error: ${JSON.stringify(error)}`);
            return {
                isOk: false,
                ...ERRORS.DELETE_MANY_INBOUNDS_ERROR,
            };
        }
    }
}
