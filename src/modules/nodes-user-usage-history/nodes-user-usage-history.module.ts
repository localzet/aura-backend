import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { NodesUserUsageHistoryRepository } from './repositories/nodes-user-usage-history.repository';
import { NodesUserUsageHistoryController } from './nodes-user-usage-history.controller';
import { NodesUserUsageHistoryConverter } from './nodes-user-usage-history.converter';
import { NodesUserUsageHistoryService } from './nodes-user-usage-history.service';
import { COMMANDS } from './commands';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule],
    controllers: [NodesUserUsageHistoryController],
    providers: [
        NodesUserUsageHistoryRepository,
        NodesUserUsageHistoryConverter,
        NodesUserUsageHistoryService,
        ...COMMANDS,
        ...QUERIES,
    ],
})
export class NodesUserUsageHistoryModule {
}
