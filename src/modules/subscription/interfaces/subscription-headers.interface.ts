export interface ISubscriptionHeaders {
    'content-disposition': string;
    'profile-title': string;
    'profile-update-interval': string;
    'profile-web-page-url'?: string;
    'subscription-userinfo': string;
    'support-url': string;
    announce?: string;
    routing?: string;

    [key: string]: string | undefined;
}
