import { TelegramBotLoggerQueueModule } from './telegram-bot-logger/telegram-bot-logger.module';
import { WebhookLoggerQueueModule } from './webhook-logger/webhook-logger.module';

export const NOTIFICATIONS_MODULES = [TelegramBotLoggerQueueModule, WebhookLoggerQueueModule];
