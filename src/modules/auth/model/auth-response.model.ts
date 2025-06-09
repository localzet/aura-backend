export class AuthResponseModel {
    public readonly accessToken: string;

    constructor(data: AuthResponseModel) {
        this.accessToken = data.accessToken;
    }
}
