import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@common/database';

import { AdminRepository } from './repositories/admin.repository';
import { AdminConverter } from './admin.converter';
import { COMMANDS } from './commands';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule, PrismaModule],
    controllers: [],
    providers: [AdminRepository, AdminConverter, ...QUERIES, ...COMMANDS],
})
export class AdminModule {
}
