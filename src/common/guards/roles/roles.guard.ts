import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HttpExceptionWithErrorCodeType } from '@common/exception/http-exeception-with-error-code.type';
import { ERRORS, ROLE, TRole } from '@localzet/aura-contract/constants';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<TRole[]>(ROLE, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const hasRole = requiredRoles.some((role) => user.role?.includes(role));

        if (!hasRole) {
            throw new HttpExceptionWithErrorCodeType(
                ERRORS.FORBIDDEN_ROLE_ERROR.message,
                ERRORS.FORBIDDEN_ROLE_ERROR.code,
                ERRORS.FORBIDDEN_ROLE_ERROR.httpCode,
            );
        }
        return hasRole;
    }
}
