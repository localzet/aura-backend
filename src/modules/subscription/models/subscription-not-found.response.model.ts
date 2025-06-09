export class SubscriptionNotFoundResponse {
    public isFound: boolean;
    public statusCode: number;
    public message: string;

    constructor() {
        this.isFound = false;
        this.statusCode = 404;
        this.message = 'Resource not found';
    }
}
