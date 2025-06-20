import { TServiceEvents } from '@localzet/aura-contract';

export interface IServiceEvent {
    loginAttempt?: {
        username: string;
        ip: string;
        userAgent: string;
        description?: string;
        password?: string;
    };
}

export class ServiceEvent {
    eventName: TServiceEvents;
    data: IServiceEvent;

    constructor(event: TServiceEvents, data: IServiceEvent) {
        this.eventName = event;
        this.data = data;
    }
}
