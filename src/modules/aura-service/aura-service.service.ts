import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EVENTS } from '@localzet/aura-contract/constants';

import { ServiceEvent } from '@integration-modules/notifications/interfaces';

@Injectable()
export class AuraServiceService implements OnApplicationBootstrap {
    constructor(private readonly eventEmitter: EventEmitter2) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        this.eventEmitter.emit(
            EVENTS.SERVICE.PANEL_STARTED,
            new ServiceEvent(EVENTS.SERVICE.PANEL_STARTED, {}),
        );
    }
}
