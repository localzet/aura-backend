import { BasicStrategy as BasicStrategyBase } from 'passport-http';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(BasicStrategyBase, 'basic') {
    private readonly metricsPass: string;
    private readonly metricsUser: string;

    constructor(private readonly configService: ConfigService) {
        super();
        this.metricsPass = this.configService.getOrThrow<string>('METRICS_PASS');
        this.metricsUser = this.configService.getOrThrow<string>('METRICS_USER');
    }

    validate(username: string, password: string): boolean {
        if (username === this.metricsUser && password === this.metricsPass) {
            return true;
        }

        throw new UnauthorizedException();
    }
}
