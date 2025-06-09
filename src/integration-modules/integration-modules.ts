import { ConditionalModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TelegramBotModule } from './notifications/telegram-bot/telegram-bot.module';
import { WebhookModule } from './notifications/webhook-module/webhook.module';

@Module({
    imports: [
        ConditionalModule.registerWhen(TelegramBotModule, 'IS_TELEGRAM_NOTIFICATIONS_ENABLED'),
        ConditionalModule.registerWhen(WebhookModule, 'WEBHOOK_ENABLED'),
    ],
})
export class IntegrationModules {
}
