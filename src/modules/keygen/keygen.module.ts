import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { getJWTConfig } from '@common/config/jwt/jwt.config';

import { KeygenRepository } from './repositories/keygen.repository';
import { KeygenController } from './keygen.controller';
import { KeygenConverter } from './keygen.converter';
import { KeygenService } from './keygen.service';
import { COMMANDS } from './commands';

@Module({
    imports: [CqrsModule, JwtModule.registerAsync(getJWTConfig())],
    controllers: [KeygenController],
    providers: [KeygenRepository, KeygenService, KeygenConverter, ...COMMANDS],
})
export class KeygenModule {
}
