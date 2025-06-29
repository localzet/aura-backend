import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { RecordUserUsageQueueProcessor } from './record-user-usage.processor';
import { RecordUserUsageQueueService } from './record-user-usage.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [RecordUserUsageQueueProcessor];
const services = [RecordUserUsageQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.recordUserUsage })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.recordUserUsage, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class RecordUserUsageQueueModule {
}
