import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { IncrementUsedTrafficCommand } from './increment-used-traffic.command';
import { UsersRepository } from '../../repositories/users.repository';

@CommandHandler(IncrementUsedTrafficCommand)
export class IncrementUsedTrafficHandler
    implements ICommandHandler<IncrementUsedTrafficCommand, ICommandResponse<void>> {
    public readonly logger = new Logger(IncrementUsedTrafficHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    @Transactional<TransactionalAdapterPrisma>({
        maxWait: 20_000,
        timeout: 120_000,
    })
    async execute(command: IncrementUsedTrafficCommand): Promise<ICommandResponse<void>> {
        try {
            await this.usersRepository.incrementUsedTraffic(command.userUuid, command.bytes);

            return {
                isOk: true,
            };
        } catch (error: unknown) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.INCREMENT_USED_TRAFFIC_ERROR,
            };
        }
    }
}
