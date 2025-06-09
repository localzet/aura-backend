import requestIp from 'request-ip';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.clientIp) {
        return request.clientIp;
    }

    const ip = requestIp.getClientIp(request);
    return ip || 'Unknown';
});
