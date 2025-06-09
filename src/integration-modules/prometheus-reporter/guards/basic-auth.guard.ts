import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
    canActivate(context: ExecutionContext) {
        const response = context.switchToHttp().getResponse();

        response.setHeader('WWW-Authenticate', 'Basic realm="Prometheus Metrics"');

        return super.canActivate(context);
    }
}
