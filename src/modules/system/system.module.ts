import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
    imports: [CqrsModule],
    controllers: [SystemController],
    providers: [SystemService],
})
export class SystemModule {
}
