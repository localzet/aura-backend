import { TUserEvents } from '@localzet/aura-contract/constants';

import { UserWithActiveInboundsEntity } from '@modules/users/entities/user-with-active-inbounds.entity';

export class UserEvent {
    user: UserWithActiveInboundsEntity;
    eventName: TUserEvents;
    skipTelegramNotification?: boolean;

    constructor(
        user: UserWithActiveInboundsEntity,
        event: TUserEvents,
        skipTelegramNotification?: boolean,
    ) {
        this.user = user;
        this.eventName = event;
        this.skipTelegramNotification = skipTelegramNotification ?? false;
    }
}
