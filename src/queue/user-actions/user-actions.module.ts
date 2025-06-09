import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { UserActionsQueueProcessor } from './user-actions.processor';
import { UserActionsQueueService } from './user-actions.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [UserActionsQueueProcessor];
const services = [UserActionsQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.userActions })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.userActions, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class UserActionsQueueModule {
}
