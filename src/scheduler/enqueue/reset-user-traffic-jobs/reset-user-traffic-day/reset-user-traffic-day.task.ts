import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { JOBS_INTERVALS } from '@scheduler/intervals';

import { ResetUserTrafficQueueService } from '@queue/reset-user-traffic';

@Injectable()
export class ResetUserTrafficCalendarDayTask {
    private static readonly CRON_NAME = 'resetUserTrafficCalendarDay';
    private readonly logger = new Logger(ResetUserTrafficCalendarDayTask.name);

    constructor(private readonly resetUserTrafficQueueService: ResetUserTrafficQueueService) {
    }

    @Cron(JOBS_INTERVALS.RESET_USER_TRAFFIC.DAILY, {
        name: ResetUserTrafficCalendarDayTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            await this.resetUserTrafficQueueService.resetDailyUserTraffic();
        } catch (error) {
            this.logger.error(`Error in ResetUserTrafficCalendarDayTask: ${error}`);
        }
    }
}
