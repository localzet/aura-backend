import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { NodesModule } from '@modules/nodes';

import { StartNodeQueueProcessor } from './start-node.processor';
import { StartNodeQueueService } from './start-node.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule, NodesModule];

const processors = [StartNodeQueueProcessor];
const services = [StartNodeQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.startNode })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.startNode, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class StartNodeQueueModule {
}
