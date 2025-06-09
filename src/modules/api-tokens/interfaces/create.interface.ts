export interface ICreateApiTokenRequest {
    tokenDescription: null | string;
    tokenName: string;
}

export interface ICreateApiTokenResponse {
    token: string;
    uuid: string;
}
