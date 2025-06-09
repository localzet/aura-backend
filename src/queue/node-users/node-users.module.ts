import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { NodeUsersQueueProcessor } from './node-users.processor';
import { NodeUsersQueueService } from './node-users.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [NodeUsersQueueProcessor];
const services = [NodeUsersQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.nodeUsers })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.nodeUsers, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class NodeUsersQueueModule {
}
