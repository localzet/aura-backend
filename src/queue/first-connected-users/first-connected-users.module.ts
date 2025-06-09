import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { FirstConnectedUsersQueueProcessor } from './first-connected-users.processor';
import { FirstConnectedUsersQueueService } from './first-connected-users.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [FirstConnectedUsersQueueProcessor];
const services = [FirstConnectedUsersQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.firstConnectedUsers })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.firstConnectedUsers, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class FirstConnectedUsersQueueModule {
}
