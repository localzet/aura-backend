import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@common/database';

import { ApiTokensRepository } from './repositories/api-tokens.repository';
import { ApiTokensController } from './api-tokens.controllers';
import { ApiTokenConverter } from './api-tokens.converter';
import { ApiTokensService } from './api-tokens.service';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule, PrismaModule],
    controllers: [ApiTokensController],
    providers: [ApiTokensRepository, ApiTokenConverter, ApiTokensService, ...QUERIES],
})
export class ApiTokensModule {
}
