import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { NodesModule } from '@modules/nodes';

import { StartAllNodesQueueProcessor } from './start-all-nodes.processor';
import { StartAllNodesQueueService } from './start-all-nodes.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule, NodesModule];

const processors = [StartAllNodesQueueProcessor];
const services = [StartAllNodesQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.startAllNodes })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.startAllNodes, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class StartAllNodesQueueModule {
}
