import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { ConditionalModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { WebhookModule } from '@integration-modules/notifications/webhook-module/webhook.module';

import { WebhookLoggerQueueProcessor } from './webhook-logger.processor';
import { WebhookLoggerQueueService } from './webhook-logger.service';
import { QueueNames } from '../../queue.enum';

const requiredModules = [
    HttpModule,
    ConditionalModule.registerWhen(WebhookModule, 'WEBHOOK_ENABLED'),
];

const processors = [WebhookLoggerQueueProcessor];
const services = [WebhookLoggerQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.webhookLogger })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.webhookLogger, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class WebhookLoggerQueueModule {
}
