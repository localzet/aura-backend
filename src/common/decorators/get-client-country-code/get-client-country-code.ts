import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetClientCountryCode = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        const country = request.headers['cf-ipcountry'] as null | string;
        if (!country) {
            return 'XX';
        }
        return country;
    },
);
