import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-backend-contract/constants';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { GetUserByShortUuidQuery } from './get-user-by-short-uuid.query';
import { UsersRepository } from '../../repositories/users.repository';

@QueryHandler(GetUserByShortUuidQuery)
export class GetUserByShortUuidHandler
    implements IQueryHandler<GetUserByShortUuidQuery, ICommandResponse<UserWithActiveInboundsEntity>> {
    private readonly logger = new Logger(GetUserByShortUuidHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(
        query: GetUserByShortUuidQuery,
    ): Promise<ICommandResponse<UserWithActiveInboundsEntity>> {
        try {
            const user = await this.usersRepository.getUserByShortUuid(query.shortUuid);

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
