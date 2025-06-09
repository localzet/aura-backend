---
to: "src/queue/<%= h.queueFolderName(queueName) %>/<%= h.queueModuleFileName(queueName) %>.ts"
unless_exists: true
---
<%
  QueueNameEnumKey = h.QueueNameEnumKey(queueName)

  QueueModuleName = h.QueueModuleName(queueName)  
  QueueProcessorName = h.QueueProcessorName(queueName)
  QueueServiceName = h.QueueServiceName(queueName)

  queueProcessorFileName = h.queueProcessorFileName(queueName)
  queueServiceFileName = h.queueServiceFileName(queueName)

%>import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { useBullBoard, useQueueProcessor } from '@common/utils/startup-app';

import { <%= QueueProcessorName %> } from './<%= queueProcessorFileName %>';
import { <%= QueueServiceName %> } from './<%= queueServiceFileName %>';
import { QueueNames } from '../queue.enum';

const requiredModules = [CqrsModule];

const processors = [<%= QueueProcessorName %>];
const services = [<%= QueueServiceName %>];

const queues = [BullModule.registerQueue({ name: QueueNames.<%= QueueNameEnumKey %> })];

const bullBoard = [
    BullBoardModule.forFeature({ name: QueueNames.<%= QueueNameEnumKey %>, adapter: BullMQAdapter }),
];

const providers = useQueueProcessor() ? processors : [];
const imports = useBullBoard() ? bullBoard : [];

@Module({
    imports: [...queues, ...imports, ...requiredModules],
    providers: [...providers, ...services],
    exports: [...services],
})
export class <%= QueueModuleName %> {}
