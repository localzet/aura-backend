export class RegisterResponseModel {
    public readonly accessToken: string;

    constructor(data: { accessToken: string }) {
        this.accessToken = data.accessToken;
    }
}
