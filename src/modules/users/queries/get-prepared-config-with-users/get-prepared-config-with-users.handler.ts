import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { XRayConfig } from '@common/helpers/xray-config/xray-config.validator';
import { ICommandResponse } from '@common/types/command-response.type';
import { IXrayConfig } from '@common/helpers/xray-config/interfaces';
import { ERRORS } from '@localzet/aura-contract';

import { XrayConfigEntity } from '@modules/xray-config/entities/xray-config.entity';
import { GetXrayConfigQuery } from '@modules/xray-config/queries/get-xray-config';
import { UsersRepository } from '@modules/users/repositories/users.repository';

import { GetPreparedConfigWithUsersQuery } from './get-prepared-config-with-users.query';

@QueryHandler(GetPreparedConfigWithUsersQuery)
export class GetPreparedConfigWithUsersHandler
    implements IQueryHandler<GetPreparedConfigWithUsersQuery, ICommandResponse<IXrayConfig>> {
    private readonly logger = new Logger(GetPreparedConfigWithUsersHandler.name);

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly queryBus: QueryBus,
    ) {
    }

    async execute(query: GetPreparedConfigWithUsersQuery): Promise<ICommandResponse<IXrayConfig>> {
        let config: XRayConfig | null = null;
        try {
            const { excludedInbounds, excludeInboundsFromConfig } = query;

            const xrayConfig = await this.getXrayConfig();

            config = new XRayConfig(xrayConfig.config!);

            if (excludeInboundsFromConfig) {
                config.excludeInbounds(excludedInbounds.map((inbound) => inbound.tag));
            }

            config.processCertificates();

            const usersStream = this.usersRepository.getUsersForConfigStream(excludedInbounds);

            for await (const userBatch of usersStream) {
                config.includeUserBatch(userBatch);
            }

            return {
                isOk: true,
                response: config.getConfig(),
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.INTERNAL_SERVER_ERROR,
            };
        } finally {
            config = null;
        }
    }

    private async getXrayConfig(): Promise<XrayConfigEntity> {
        return this.queryBus.execute<GetXrayConfigQuery, XrayConfigEntity>(
            new GetXrayConfigQuery(),
        );
    }
}
