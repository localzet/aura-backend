import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { ExpireUserNotificationsQueueProcessor } from './expire-user-notifications.processor';
import { ExpireUserNotificationsQueueService } from './expire-user-notifications.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [ExpireUserNotificationsQueueProcessor];
const services = [ExpireUserNotificationsQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.expireUserNotifications })];

const bullBoard = [
    BullBoardModule.forFeature({
        name: QueueNames.expireUserNotifications,
        adapter: BullMQAdapter,
    }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class ExpireUserNotificationsQueueModule {
}
