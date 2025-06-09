---
to: "src/queue/<%= h.queueFolderName(queueName) %>/<%= h.queueProcessorFileName(queueName) %>.ts"
unless_exists: true
---
<%
  QueueNameEnumKey = h.QueueNameEnumKey(queueName)
  QueueJobNamesEnumName = h.QueueJobNamesEnumName(queueName)

  QueueProcessorName = h.QueueProcessorName(queueName)

%>import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { <%= QueueJobNamesEnumName %> } from './enums';
import { QueueNames } from '../queue.enum';

@Processor(QueueNames.<%= QueueNameEnumKey %>)
export class <%= QueueProcessorName %> extends WorkerHost {
    private readonly logger = new Logger(<%= QueueProcessorName %>.name)

    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case <%= QueueJobNamesEnumName %>.exampleJob:
                return this.handleExampleJob(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }
    }

    private async handleExampleJob(job: Job) {
        this.logger.debug(
            `Handling "${<%= QueueJobNamesEnumName %>.exampleJob}" job with ID: ${job?.id || ''}, data: ${JSON.stringify(job?.data || '')}`,
        );

        try {
        } catch (error) {
            this.logger.error(`Error handling "${<%= QueueJobNamesEnumName %>.exampleJob}" job: ${error}`);
        }
    }
}
