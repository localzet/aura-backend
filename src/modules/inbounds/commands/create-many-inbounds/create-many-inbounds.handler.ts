import { ERRORS } from '@localzet/aura-contract';

import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { InboundsRepository } from '../../repositories/inbounds.repository';
import { CreateManyInboundsCommand } from './create-many-inbounds.command';

@CommandHandler(CreateManyInboundsCommand)
export class CreateManyInboundsHandler
    implements ICommandHandler<CreateManyInboundsCommand, ICommandResponse<void>> {
    public readonly logger = new Logger(CreateManyInboundsHandler.name);

    constructor(private readonly inboundsRepository: InboundsRepository) {
    }

    @Transactional<TransactionalAdapterPrisma>({
        maxWait: 20_000,
        timeout: 120_000,
    })
    async execute(command: CreateManyInboundsCommand): Promise<ICommandResponse<void>> {
        try {
            await this.inboundsRepository.createMany(command.inbounds);
            return {
                isOk: true,
            };
        } catch (error: unknown) {
            this.logger.error(`Error: ${JSON.stringify(error)}`);
            return {
                isOk: false,
                ...ERRORS.CREATE_MANY_INBOUNDS_ERROR,
            };
        }
    }
}
