import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { GetExceededTrafficUsageUsersQuery } from './get-exceeded-traffic-usage-users.query';
import { UsersRepository } from '../../repositories/users.repository';

@QueryHandler(GetExceededTrafficUsageUsersQuery)
export class GetExceededTrafficUsageUsersHandler
    implements IQueryHandler<
        GetExceededTrafficUsageUsersQuery,
        ICommandResponse<UserWithActiveInboundsEntity[]>
    > {
    private readonly logger = new Logger(GetExceededTrafficUsageUsersHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(): Promise<ICommandResponse<UserWithActiveInboundsEntity[]>> {
        try {
            const users = await this.usersRepository.findExceededTrafficUsers();

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
