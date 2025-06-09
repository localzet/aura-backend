import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { BulkUserOperationsQueueProcessor } from './bulk-user-operations.processor';
import { BulkUserOperationsQueueService } from './bulk-user-operations.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [BulkUserOperationsQueueProcessor];
const services = [BulkUserOperationsQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.bulkUserOperations })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.bulkUserOperations, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class BulkUserOperationsQueueModule {
}
