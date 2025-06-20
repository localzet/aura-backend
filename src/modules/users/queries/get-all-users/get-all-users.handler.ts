import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { GetAllUsersQuery } from './get-all-users.query';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler
    implements IQueryHandler<GetAllUsersQuery, ICommandResponse<UserWithActiveInboundsEntity[]>> {
    private readonly logger = new Logger(GetAllUsersHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(): Promise<ICommandResponse<UserWithActiveInboundsEntity[]>> {
        try {
            // REMINDER: don't use this query!

            const users = await this.usersRepository.getAllUsersWithActiveInbounds();

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
