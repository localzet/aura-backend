import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { GetActiveUsersQuery } from './get-active-users.query';

@QueryHandler(GetActiveUsersQuery)
export class GetActiveUsersHandler
    implements IQueryHandler<GetActiveUsersQuery, ICommandResponse<UserWithActiveInboundsEntity[]>> {
    private readonly logger = new Logger(GetActiveUsersHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(): Promise<ICommandResponse<UserWithActiveInboundsEntity[]>> {
        try {
            const users = await this.usersRepository.findAllActiveUsers();

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
