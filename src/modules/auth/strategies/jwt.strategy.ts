import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { IJWTAuthPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'registeredUserJWT') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_AUTH_SECRET'),
        });
    }

    async validate(JWTPrivatePayload: IJWTAuthPayload): Promise<IJWTAuthPayload> {
        return JWTPrivatePayload;
    }
}
