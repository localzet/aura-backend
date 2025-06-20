import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract';

import { NodesRepository } from '../../repositories/nodes.repository';
import { NodesEntity } from '../../entities/nodes.entity';
import { GetAllNodesQuery } from './get-all-nodes.query';

@QueryHandler(GetAllNodesQuery)
export class GetAllNodesHandler
    implements IQueryHandler<GetAllNodesQuery, ICommandResponse<NodesEntity[]>> {
    private readonly logger = new Logger(GetAllNodesHandler.name);

    constructor(private readonly nodesRepository: NodesRepository) {
    }

    async execute(): Promise<ICommandResponse<NodesEntity[]>> {
        try {
            const nodes = await this.nodesRepository.findAllNodes();

            return {
                isOk: true,
                response: nodes,
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
