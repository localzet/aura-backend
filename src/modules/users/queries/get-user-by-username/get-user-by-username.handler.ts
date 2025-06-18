import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-backend-contract/constants';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { GetUserByUsernameQuery } from './get-user-by-username.query';
import { UsersRepository } from '../../repositories/users.repository';

@QueryHandler(GetUserByUsernameQuery)
export class GetUserByUsernameHandler
    implements IQueryHandler<GetUserByUsernameQuery, ICommandResponse<UserWithActiveInboundsEntity>> {
    private readonly logger = new Logger(GetUserByUsernameHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(
        query: GetUserByUsernameQuery,
    ): Promise<ICommandResponse<UserWithActiveInboundsEntity>> {
        try {
            const user = await this.usersRepository.findUserByUsername(query.username);

            if (!user) {
                return {
                    isOk: false,
                    ...ERRORS.USER_NOT_FOUND,
                };
            }

            return {
                isOk: true,
                response: user,
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
