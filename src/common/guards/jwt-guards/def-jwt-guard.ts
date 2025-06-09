import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryBus } from '@nestjs/cqrs';

import { ICommandResponse } from '@common/types/command-response.type';
import { ROLE } from '@libs/contracts/constants';

import { GetAdminByUsernameQuery } from '@modules/admin/queries/get-admin-by-username';
import { GetTokenByUuidQuery } from '@modules/api-tokens/queries/get-token-by-uuid';
import { ApiTokenEntity } from '@modules/api-tokens/entities/api-token.entity';
import { AdminEntity } from '@modules/admin/entities/admin.entity';
import { IJWTAuthPayload } from '@modules/auth/interfaces';

@Injectable()
export class JwtDefaultGuard extends AuthGuard('registeredUserJWT') {
    constructor(private readonly queryBus: QueryBus) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isJwtValid = await super.canActivate(context);
        if (!isJwtValid) {
            return false;
        }

        const { user } = context.switchToHttp().getRequest<{ user: IJWTAuthPayload }>();

        if (!user || !user.role || !user.uuid) {
            return false;
        }

        switch (user.role) {
            case ROLE.API: {
                const token = await this.getTokenByUuid({ uuid: user.uuid });
                if (!token.isOk) {
                    return false;
                }
                return true;
            }
            case ROLE.ADMIN: {
                if (!user.username) {
                    return false;
                }

                const adminEntity = await this.getAdminByUsername({
                    username: user.username,
                    role: user.role,
                });

                if (!adminEntity.isOk || !adminEntity.response) {
                    return false;
                }

                if (adminEntity.response.uuid !== user.uuid) {
                    return false;
                }
                return true;
            }
            default:
                return false;
        }
    }

    private async getAdminByUsername(
        dto: GetAdminByUsernameQuery,
    ): Promise<ICommandResponse<AdminEntity>> {
        return this.queryBus.execute<GetAdminByUsernameQuery, ICommandResponse<AdminEntity>>(
            new GetAdminByUsernameQuery(dto.username, dto.role),
        );
    }

    private async getTokenByUuid(
        dto: GetTokenByUuidQuery,
    ): Promise<ICommandResponse<ApiTokenEntity>> {
        return this.queryBus.execute<GetTokenByUuidQuery, ICommandResponse<ApiTokenEntity>>(
            new GetTokenByUuidQuery(dto.uuid),
        );
    }
}
