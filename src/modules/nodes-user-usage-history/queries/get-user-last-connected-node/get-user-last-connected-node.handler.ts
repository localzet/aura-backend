import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { ILastConnectedNode } from '@modules/nodes-user-usage-history/interfaces';

import { NodesUserUsageHistoryRepository } from '../../repositories/nodes-user-usage-history.repository';
import { GetUserLastConnectedNodeQuery } from './get-user-last-connected-node.query';

@QueryHandler(GetUserLastConnectedNodeQuery)
export class GetUserLastConnectedNodeHandler
    implements IQueryHandler<GetUserLastConnectedNodeQuery, ICommandResponse<ILastConnectedNode | null>> {
    private readonly logger = new Logger(GetUserLastConnectedNodeHandler.name);

    constructor(
        private readonly nodesUserUsageHistoryRepository: NodesUserUsageHistoryRepository,
    ) {
    }

    async execute(
        query: GetUserLastConnectedNodeQuery,
    ): Promise<ICommandResponse<ILastConnectedNode | null>> {
        try {
            const result = await this.nodesUserUsageHistoryRepository.getUserLastConnectedNode(
                query.userUuid,
            );

            return {
                isOk: true,
                response: result,
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
