import { ERRORS } from '@localzet/aura-contract';

import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { BatchResetLimitedUsersTrafficCommand } from './batch-reset-limited-users-traffic.command';
import { UsersRepository } from '../../repositories/users.repository';

@CommandHandler(BatchResetLimitedUsersTrafficCommand)
export class BatchResetLimitedUsersTrafficHandler
    implements ICommandHandler<BatchResetLimitedUsersTrafficCommand, ICommandResponse<{ uuid: string }[]>> {
    public readonly logger = new Logger(BatchResetLimitedUsersTrafficHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    @Transactional<TransactionalAdapterPrisma>({
        maxWait: 20_000,
        timeout: 120_000,
    })
    async execute(
        command: BatchResetLimitedUsersTrafficCommand,
    ): Promise<ICommandResponse<{ uuid: string }[]>> {
        try {
            const result = await this.usersRepository.resetLimitedUsersTraffic(command.strategy);

            return {
                isOk: true,
                response: result,
            };
        } catch (error: unknown) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.UPDATE_USER_ERROR,
            };
        }
    }
}
