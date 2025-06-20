import { TErrorsEvents } from '@localzet/aura-contract';

export interface IErrorEvent {
    description: string;
}

export class CustomErrorEvent {
    eventName: TErrorsEvents;
    data: IErrorEvent;

    constructor(event: TErrorsEvents, data: IErrorEvent) {
        this.eventName = event;
        this.data = data;
    }
}
