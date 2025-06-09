import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { UserJobsQueueProcessor } from './user-jobs.processor';
import { UserJobsQueueService } from './user-jobs.service';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [UserJobsQueueProcessor];
const services = [UserJobsQueueService];

const queues = [BullModule.registerQueue({ name: QueueNames.userJobs })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.userJobs, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class UserJobsQueueModule {
}
