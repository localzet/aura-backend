import { ConditionalModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { isRestApi, isScheduler } from '@common/utils/startup-app';

import { NodesTrafficUsageHistoryModule } from './nodes-traffic-usage-history/nodes-traffic-usage-history.module';
import { NodesUserUsageHistoryModule } from './nodes-user-usage-history/nodes-user-usage-history.module';
import { SubscriptionTemplateModule } from './subscription-template/subscription-template.module';
import { SubscriptionSettingsModule } from './subscription-settings/subscription-settings.module';
import { UserTrafficHistoryModule } from './user-traffic-history/user-traffic-history.module';
import { NodesUsageHistoryModule } from './nodes-usage-history/nodes-usage-history.module';
import { AuraServiceModule } from '@modules/aura-service/aura-service.module';
import { HwidUserDevicesModule } from './hwid-user-devices/hwid-user-devices.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ApiTokensModule } from './api-tokens/api-tokens.module';
import { InboundsModule } from './inbounds/inbounds.module';
import { KeygenModule } from './keygen/keygen.module';
import { SystemModule } from './system/system.module';
import { HostsModule } from './hosts/hosts.module';
import { NodesModule } from './nodes/nodes.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { XrayConfigModule } from './xray-config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConditionalModule.registerWhen(AdminModule, () => isRestApi()),
        ConditionalModule.registerWhen(AuthModule, () => isRestApi()),
        UsersModule,
        ConditionalModule.registerWhen(SubscriptionModule, () => isRestApi()),
        ConditionalModule.registerWhen(ApiTokensModule, () => isRestApi()),
        KeygenModule,
        NodesModule,
        NodesTrafficUsageHistoryModule,
        HostsModule,
        UserTrafficHistoryModule,
        NodesUserUsageHistoryModule,
        HwidUserDevicesModule,
        NodesUsageHistoryModule,
        InboundsModule,
        XrayConfigModule,
        ConditionalModule.registerWhen(SystemModule, () => isRestApi()),
        ConditionalModule.registerWhen(SubscriptionTemplateModule, () => isRestApi()),
        ConditionalModule.registerWhen(SubscriptionSettingsModule, () => isRestApi()),
        ConditionalModule.registerWhen(AuraServiceModule, () => isScheduler()),
    ],
})
export class AuraModules {
}
