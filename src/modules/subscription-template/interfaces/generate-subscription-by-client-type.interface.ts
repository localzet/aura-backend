import { XRayConfig } from '@common/helpers/xray-config/xray-config.validator';
import { TSubscriptionTemplateType } from '@libs/contracts/constants';

import { UserWithActiveInboundsEntity } from '@modules/users/entities/user-with-active-inbounds.entity';
import { HostWithInboundTagEntity } from '@modules/hosts/entities/host-with-inbound-tag.entity';

export interface IGenerateSubscriptionByClientType {
    userAgent: string;
    user: UserWithActiveInboundsEntity;
    hosts: HostWithInboundTagEntity[];
    config: XRayConfig;
    clientType: TSubscriptionTemplateType;
}
