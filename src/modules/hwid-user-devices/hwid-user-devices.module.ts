import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { HwidUserDevicesRepository } from './repositories/hwid-user-devices.repository';
import { HwidUserDevicesController } from './hwid-user-devices.controller';
import { HwidUserDevicesConverter } from './hwid-user-devices.converter';
import { HwidUserDevicesService } from './hwid-user-devices.service';
import { COMMANDS } from './commands';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule],
    controllers: [HwidUserDevicesController],
    providers: [
        HwidUserDevicesRepository,
        HwidUserDevicesConverter,
        HwidUserDevicesService,
        ...COMMANDS,
        ...QUERIES,
    ],
})
export class HwidUserDevicesModule {
}
