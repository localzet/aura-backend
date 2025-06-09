import { createHmac } from 'node:crypto';
import { retry } from 'rxjs/operators';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

import { IBaseWebhookLogger } from './interfaces';
import { WebhookLoggerJobNames } from './enums';
import { QueueNames } from '../../queue.enum';

@Processor(QueueNames.webhookLogger, {
    concurrency: 150,
    limiter: {
        max: 130,
        duration: 1_000,
    },
})
export class WebhookLoggerQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(WebhookLoggerQueueProcessor.name);

    private readonly webhookUrl: string | undefined;
    private readonly webhookSecret: string | undefined;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        super();
        this.webhookUrl = this.configService.get<string>('WEBHOOK_URL');
        this.webhookSecret = this.configService.get<string>('WEBHOOK_SECRET_HEADER');
    }

    async process(job: Job) {
        switch (job.name) {
            case WebhookLoggerJobNames.sendWebhook:
                return this.handleSendWebhook(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }
    }

    private async handleSendWebhook(job: Job<IBaseWebhookLogger>) {
        try {
            if (!this.webhookUrl || !this.webhookSecret) {
                this.logger.error('Webhook URL or secret is not set');
                return { isOk: false };
            }

            const signature = createHmac('sha256', this.webhookSecret)
                .update(job.data.payload)
                .digest('hex');

            await firstValueFrom(
                this.httpService
                    .post(this.webhookUrl, job.data.payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Aura-Signature': signature,
                            'X-Aura-Timestamp': job.data.timestamp,
                            'User-Agent': 'Aura',
                        },
                    })
                    .pipe(
                        retry({
                            count: 3,
                            delay: 5000,
                        }),
                        catchError((error) =>
                            throwError(
                                () =>
                                    new Error(
                                        `Failed to send webhook after 3 retries: ${error.message}`,
                                    ),
                            ),
                        ),
                    ),
            );

            return { isOk: true };
        } catch (error) {
            this.logger.error(
                `Error handling "${WebhookLoggerJobNames.sendWebhook}" job: ${error}`,
            );

            return { isOk: false };
        }
    }
}
