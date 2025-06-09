import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { NodesModule } from '@modules/nodes';

import { StopNodeQueueProcessor } from './stop-node.processor';
import { StopNodeQueueService } from './stop-node.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [NodesModule];

const processors = [StopNodeQueueProcessor];
const services = [StopNodeQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.stopNode })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.stopNode, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class StopNodeQueueModule {
}
