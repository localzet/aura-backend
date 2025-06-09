import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { JOBS_INTERVALS } from '@scheduler/intervals';

import { ResetUserTrafficQueueService } from '@queue/reset-user-traffic';

@Injectable()
export class ResetUserTrafficCalendarMonthTask {
    private static readonly CRON_NAME = 'resetUserTrafficCalendarMonth';
    private readonly logger = new Logger(ResetUserTrafficCalendarMonthTask.name);

    constructor(private readonly resetUserTrafficQueueService: ResetUserTrafficQueueService) {
    }

    @Cron(JOBS_INTERVALS.RESET_USER_TRAFFIC.MONTHLY, {
        name: ResetUserTrafficCalendarMonthTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            await this.resetUserTrafficQueueService.resetMonthlyUserTraffic();
        } catch (error) {
            this.logger.error(`Error in ResetUserTrafficCalendarMonthTask: ${error}`);
        }
    }
}
