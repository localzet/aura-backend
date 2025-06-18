import { ERRORS } from '@localzet/aura-backend-contract/constants';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';

import { NodeInboundExclusionsRepository } from '@modules/inbounds/repositories/node-inbound-exclusions.repository';

import { ResetNodeInboundExclusionsByNodeUuidCommand } from './reset-node-inbound-exclusions-by-node-uuid.command';

@CommandHandler(ResetNodeInboundExclusionsByNodeUuidCommand)
export class ResetNodeInboundExclusionByNodeUuidHandler
    implements ICommandHandler<ResetNodeInboundExclusionsByNodeUuidCommand, ICommandResponse<number>> {
    public readonly logger = new Logger(ResetNodeInboundExclusionByNodeUuidHandler.name);

    constructor(
        private readonly nodeInboundExclusionsRepository: NodeInboundExclusionsRepository,
    ) {
    }

    @Transactional()
    async execute(
        command: ResetNodeInboundExclusionsByNodeUuidCommand,
    ): Promise<ICommandResponse<number>> {
        try {
            const count = await this.nodeInboundExclusionsRepository.setExcludedInbounds(
                command.nodeUuid,
                command.excludedInbounds,
            );
            return {
                isOk: true,
                response: count,
            };
        } catch (error: unknown) {
            this.logger.error(`Error: ${error}`);
            return {
                isOk: false,
                ...ERRORS.DELETE_MANY_INBOUNDS_ERROR,
            };
        }
    }
}
