import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { ResetUserTrafficQueueProcessor } from './reset-user-traffic.processor';
import { ResetUserTrafficQueueService } from './reset-user-traffic.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [ResetUserTrafficQueueProcessor];
const services = [ResetUserTrafficQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.resetUserTraffic })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.resetUserTraffic, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class ResetUserTrafficQueueModule {
}
