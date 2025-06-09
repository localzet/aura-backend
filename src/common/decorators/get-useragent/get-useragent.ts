import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.headers['user-agent']) {
        return request.headers['user-agent'];
    }

    return 'Unknown';
});
