import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { HostsBulkActionsController, HostsController } from './controllers';
import { HostsRepository } from './repositories/hosts.repository';
import { HostsConverter } from './hosts.converter';
import { HostsService } from './hosts.service';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule],
    controllers: [HostsController, HostsBulkActionsController],
    providers: [HostsRepository, HostsConverter, HostsService, ...QUERIES],
})
export class HostsModule {
}
