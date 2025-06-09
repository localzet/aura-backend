import { ApiTokens } from '@prisma/client';

export class ApiTokenEntity implements ApiTokens {
    public uuid: string;
    public token: string;
    public tokenName: string;
    public tokenDescription: null | string;

    public createdAt: Date;
    public updatedAt: Date;

    constructor(apiToken: Partial<ApiTokens>) {
        Object.assign(this, apiToken);
        return this;
    }
}
