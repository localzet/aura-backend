import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { WEBHOOK_EVENTS } from './events';

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [...WEBHOOK_EVENTS],
})
export class WebhookModule {
}
