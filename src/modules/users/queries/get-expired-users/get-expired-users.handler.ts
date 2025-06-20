import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { GetExpiredUsersQuery } from './get-expired-users.query';

@QueryHandler(GetExpiredUsersQuery)
export class GetExpiredUsersHandler
    implements IQueryHandler<GetExpiredUsersQuery, ICommandResponse<UserWithActiveInboundsEntity[]>> {
    private readonly logger = new Logger(GetExpiredUsersHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(): Promise<ICommandResponse<UserWithActiveInboundsEntity[]>> {
        try {
            const users = await this.usersRepository.findExpiredUsers();

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
        }
    }
}
