import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { NodesUsageHistoryRepository } from './repositories/nodes-usage-history.repository';
import { NodesUsageHistoryController } from './nodes-usage-history.controller';
import { NodesUsageHistoryConverter } from './nodes-usage-history.converter';
import { NodesUsageHistoryService } from './nodes-usage-history.service';
import { COMMANDS } from './commands';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule],
    controllers: [NodesUsageHistoryController],
    providers: [
        NodesUsageHistoryService,
        NodesUsageHistoryRepository,
        NodesUsageHistoryConverter,
        ...COMMANDS,
        ...QUERIES,
    ],
})
export class NodesUsageHistoryModule {
}
