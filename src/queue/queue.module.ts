import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { BasicAuthMiddleware } from '@common/middlewares';
import { useBullBoard } from '@common/utils/startup-app';
import { BULLBOARD_ROOT } from '@libs/contracts/api';

import { ExpireUserNotificationsQueueModule } from './expire-user-notifications/expire-user-notifications.module';
import { FirstConnectedUsersQueueModule } from './first-connected-users/first-connected-users.module';
import { BulkUserOperationsQueueModule } from './bulk-user-operations/bulk-user-operations.module';
import { ResetUserTrafficQueueModule } from './reset-user-traffic/reset-user-traffic.module';
import { UpdateUsersUsageQueueModule } from './update-users-usage/update-users-usage.module';
import { NodeHealthCheckQueueModule } from './node-health-check/node-health-check.module';
import { RecordNodeUsageQueueModule } from './record-node-usage/record-node-usage.module';
import { RecordUserUsageQueueModule } from './record-user-usage/record-user-usage.module';
import { StartAllNodesQueueModule } from './start-all-nodes/start-all-nodes.module';
import { NOTIFICATIONS_MODULES } from './notifications/notifications-modules';
import { UserActionsQueueModule } from './user-actions/user-actions.module';
import { StartNodeQueueModule } from './start-node/start-node.module';
import { NodeUsersQueueModule } from './node-users/node-users.module';
import { StopNodeQueueModule } from './stop-node/stop-node.module';
import { UserJobsQueueModule } from './user-jobs/user-jobs.module';

const queueModules = [
    StartAllNodesQueueModule,
    StartNodeQueueModule,
    StopNodeQueueModule,
    NodeHealthCheckQueueModule,
    NodeUsersQueueModule,
    RecordNodeUsageQueueModule,
    RecordUserUsageQueueModule,
    ResetUserTrafficQueueModule,
    UserJobsQueueModule,
    BulkUserOperationsQueueModule,
    ExpireUserNotificationsQueueModule,
    UpdateUsersUsageQueueModule,
    FirstConnectedUsersQueueModule,
    UserActionsQueueModule,

    ...NOTIFICATIONS_MODULES,
];

const bullBoard = [
    BullBoardModule.forRoot({
        route: BULLBOARD_ROOT,
        adapter: ExpressAdapter,
        boardOptions: {
            uiConfig: {
                boardTitle: 'Aura',
                boardLogo: {
                    path: 'https://remna.st/img/logo.svg',
                    width: 32,
                    height: 32,
                },
                locale: {
                    lng: 'en',
                },
                pollingInterval: {
                    showSetting: true,
                    forceInterval: 3,
                },
                miscLinks: [
                    {
                        text: 'Return to dashboard',
                        url: '/dashboard',
                    },
                    {
                        text: 'Aura',
                        url: 'https://remna.st',
                    },
                ],
            },
        },
        middleware: [BasicAuthMiddleware],
    }),
];

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.getOrThrow<string>('REDIS_HOST'),
                    port: configService.getOrThrow<number>('REDIS_PORT'),
                    db: configService.getOrThrow<number>('REDIS_DB'),
                    password: configService.get<string | undefined>('REDIS_PASSWORD'),
                },
                defaultJobOptions: {
                    removeOnComplete: 500,
                    removeOnFail: 500,
                },
            }),
            inject: [ConfigService],
        }),

        ...(useBullBoard() ? bullBoard : []),

        ...queueModules,
    ],
    exports: [...queueModules],
})
export class QueueModule {
}
