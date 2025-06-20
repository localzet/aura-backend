import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract';

import { GetUsersForConfigQuery } from './get-users-for-config.query';
import { UsersRepository } from '../../repositories/users.repository';
import { UserForConfigEntity } from '../../entities/users-for-config';

@QueryHandler(GetUsersForConfigQuery)
export class GetUsersForConfigHandler
    implements IQueryHandler<GetUsersForConfigQuery, ICommandResponse<UserForConfigEntity[]>> {
    private readonly logger = new Logger(GetUsersForConfigHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(query: GetUsersForConfigQuery): Promise<ICommandResponse<UserForConfigEntity[]>> {
        let users: UserForConfigEntity[] | null = null;

        try {
            users = await this.usersRepository.getUsersForConfig(query.excludedInbounds);

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
