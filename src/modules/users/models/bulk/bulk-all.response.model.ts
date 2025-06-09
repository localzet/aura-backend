export class BulkAllResponseModel {
    public readonly eventSent: boolean;

    constructor(eventSent: boolean) {
        this.eventSent = eventSent;
    }
}
