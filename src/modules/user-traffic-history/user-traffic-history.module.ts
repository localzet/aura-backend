import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { UserTrafficHistoryRepository } from './repositories/user-traffic-history.repository';
import { UserTrafficHistoryConverter } from './user-traffic-history.converter';
import { COMMANDS } from './commands';

@Module({
    imports: [CqrsModule],
    controllers: [],
    providers: [UserTrafficHistoryRepository, UserTrafficHistoryConverter, ...COMMANDS],
})
export class UserTrafficHistoryModule {
}
