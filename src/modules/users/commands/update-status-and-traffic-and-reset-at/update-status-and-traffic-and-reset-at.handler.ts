import { ERRORS } from '@contract/constants';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { UpdateStatusAndTrafficAndResetAtCommand } from './update-status-and-traffic-and-reset-at.command';
import { UsersRepository } from '../../repositories/users.repository';

@CommandHandler(UpdateStatusAndTrafficAndResetAtCommand)
export class UpdateStatusAndTrafficAndResetAtHandler
    implements ICommandHandler<UpdateStatusAndTrafficAndResetAtCommand, ICommandResponse<void>> {
    public readonly logger = new Logger(UpdateStatusAndTrafficAndResetAtHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(
        command: UpdateStatusAndTrafficAndResetAtCommand,
    ): Promise<ICommandResponse<void>> {
        try {
            await this.usersRepository.updateStatusAndTrafficAndResetAt(
                command.userUuid,
                command.lastResetAt,
                command.status,
            );

            return {
                isOk: true,
            };
        } catch (error: unknown) {
            this.logger.error(`Error: ${JSON.stringify(error)}`);
            return {
                isOk: false,
                ...ERRORS.UPDATE_USER_ERROR,
            };
        }
    }
}
