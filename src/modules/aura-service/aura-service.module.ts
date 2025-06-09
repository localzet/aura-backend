import { Module } from '@nestjs/common';

import { AuraServiceService } from './aura-service.service';

@Module({
    imports: [],
    controllers: [],
    providers: [AuraServiceService],
})
export class AuraServiceModule {
}
