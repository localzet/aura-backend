import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { SubscriptionSettingsRepository } from './repositories/subscription-settings.repository';
import { SubscriptionSettingsController } from './subscription-settings.controller';
import { SubscriptionSettingsConverter } from './subscription-settings.converter';
import { SubscriptionSettingsService } from './subscription-settings.service';
import { QUERIES } from './queries';

@Module({
    imports: [CqrsModule],
    controllers: [SubscriptionSettingsController],
    providers: [
        SubscriptionSettingsService,
        SubscriptionSettingsRepository,
        SubscriptionSettingsConverter,
        ...QUERIES,
    ],
    exports: [],
})
export class SubscriptionSettingsModule {
}
