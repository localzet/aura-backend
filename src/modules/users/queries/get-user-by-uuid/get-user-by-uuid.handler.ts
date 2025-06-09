import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@libs/contracts/constants';

import { UserWithActiveInboundsEntity } from '../../entities/user-with-active-inbounds.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { GetUserByUuidQuery } from './get-user-by-uuid.query';

@QueryHandler(GetUserByUuidQuery)
export class GetUserByUuidHandler
    implements IQueryHandler<GetUserByUuidQuery, ICommandResponse<UserWithActiveInboundsEntity>> {
    private readonly logger = new Logger(GetUserByUuidHandler.name);

    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(
        query: GetUserByUuidQuery,
    ): Promise<ICommandResponse<UserWithActiveInboundsEntity>> {
        try {
            const user = await this.usersRepository.findUserByUuid(query.uuid);

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
