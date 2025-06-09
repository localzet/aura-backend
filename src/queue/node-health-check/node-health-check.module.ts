import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { NodeHealthCheckQueueProcessor } from './node-health-check.processor';
import { NodeHealthCheckQueueService } from './node-health-check.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [NodeHealthCheckQueueProcessor];
const services = [NodeHealthCheckQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.nodeHealthCheck })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.nodeHealthCheck, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class NodeHealthCheckQueueModule {
}
