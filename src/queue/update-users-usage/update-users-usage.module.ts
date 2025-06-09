import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { UpdateUsersUsageQueueProcessor } from './update-users-usage.processor';
import { UpdateUsersUsageQueueService } from './update-users-usage.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [UpdateUsersUsageQueueProcessor];
const services = [UpdateUsersUsageQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.updateUsersUsage })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.updateUsersUsage, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class UpdateUsersUsageQueueModule {
}
