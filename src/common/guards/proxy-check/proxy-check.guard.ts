import { Observable } from 'rxjs';
import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

import { isDevelopment } from '@common/utils/startup-app/is-development';

@Injectable()
export class ProxyCheckGuard implements CanActivate {
    private readonly logger = new Logger(ProxyCheckGuard.name);

    constructor(private readonly options: { exclude: string[] } = { exclude: [] }) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        if (isDevelopment()) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();

        if (this.options.exclude.includes(request.path)) {
            return true;
        }

        const isProxy = Boolean(request.headers['x-forwarded-for']);
        const isHttps = Boolean(request.headers['x-forwarded-proto'] === 'https');

        this.logger.debug(
            `X-Forwarded-For: ${request.headers['x-forwarded-for']}, X-Forwarded-Proto: ${request.headers['x-forwarded-proto']}`,
        );

        if (!isHttps || !isProxy) {
            const response = context.switchToHttp().getResponse();
            response.socket?.destroy();

            this.logger.error('Reverse proxy and HTTPS are required.');

            return false;
        }

        return true;
    }
}
