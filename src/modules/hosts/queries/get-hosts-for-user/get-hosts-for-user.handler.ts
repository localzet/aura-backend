import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@libs/contracts/constants';

import { HostWithInboundTagEntity } from '../../entities/host-with-inbound-tag.entity';
import { HostsRepository } from '../../repositories/hosts.repository';
import { GetHostsForUserQuery } from './get-hosts-for-user.query';

@QueryHandler(GetHostsForUserQuery)
export class GetHostsForUserHandler
    implements IQueryHandler<GetHostsForUserQuery, ICommandResponse<HostWithInboundTagEntity[]>> {
    private readonly logger = new Logger(GetHostsForUserHandler.name);

    constructor(private readonly hostsRepository: HostsRepository) {
    }

    async execute(
        query: GetHostsForUserQuery,
    ): Promise<ICommandResponse<HostWithInboundTagEntity[]>> {
        try {
            const hosts = await this.hostsRepository.findActiveHostsByUserUuid(query.userUuid);

            return {
                isOk: true,
                response: hosts,
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
