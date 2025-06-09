import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { RecordNodeUsageQueueProcessor } from './record-node-usage.processor';
import { RecordNodeUsageQueueService } from './record-node-usage.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [RecordNodeUsageQueueProcessor];
const services = [RecordNodeUsageQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.recordNodeUsage })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.recordNodeUsage, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class RecordNodeUsageQueueModule {
}
