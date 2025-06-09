import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { JOBS_INTERVALS } from '@scheduler/intervals';

import { ResetUserTrafficQueueService } from '@queue/reset-user-traffic';

@Injectable()
export class ResetUserTrafficCalendarWeekTask {
    private static readonly CRON_NAME = 'resetUserTrafficCalendarWeek';
    private readonly logger = new Logger(ResetUserTrafficCalendarWeekTask.name);

    constructor(private readonly resetUserTrafficQueueService: ResetUserTrafficQueueService) {
    }

    @Cron(JOBS_INTERVALS.RESET_USER_TRAFFIC.WEEKLY, {
        name: ResetUserTrafficCalendarWeekTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            await this.resetUserTrafficQueueService.resetWeeklyUserTraffic();
        } catch (error) {
            this.logger.error(`Error in ResetUserTrafficCalendarWeekTask: ${error}`);
        }
    }
}
