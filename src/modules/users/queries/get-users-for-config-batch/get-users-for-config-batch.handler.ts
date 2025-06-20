import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { GetUsersForConfigBatchQuery } from './get-users-for-config-batch.query';
import { UsersRepository } from '../../repositories/users.repository';
import { UserForConfigEntity } from '../../entities/users-for-config';

@QueryHandler(GetUsersForConfigBatchQuery)
export class GetUsersForConfigBatchHandler
    implements IQueryHandler<GetUsersForConfigBatchQuery, ICommandResponse<UserForConfigEntity[]>> {
    private readonly logger = new Logger(GetUsersForConfigBatchHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(
        query: GetUsersForConfigBatchQuery,
    ): Promise<ICommandResponse<UserForConfigEntity[]>> {
        let users: UserForConfigEntity[] | null = null;

        try {
            users = await this.usersRepository.getUsersForConfigBatch(
                query.excludedInbounds,
                query.limit,
                query.offset,
            );

            return {
                isOk: true,
                response: users,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        } finally {
            users = null;
        }
    }
}
