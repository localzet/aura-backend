import { ApiTokenEntity } from '../entities/api-token.entity';

export class FindAllApiTokensResponseModel {
    public apiKeys: {
        createdAt: Date;
        token: string;
        tokenDescription: null | string;
        tokenName: string;
        updatedAt: Date;
        uuid: string;
    }[];

    public docs: {
        isDocsEnabled: boolean;
        scalarPath: null | string;
        swaggerPath: null | string;
    };

    constructor(
        data: ApiTokenEntity,
        docs: { isDocsEnabled: boolean; scalarPath: null | string; swaggerPath: null | string },
    ) {
        this.apiKeys = [
            {
                uuid: data.uuid,
                token: data.token,
                tokenName: data.tokenName,
                tokenDescription: data.tokenDescription,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        ];
        this.docs = {
            isDocsEnabled: docs.isDocsEnabled,
            scalarPath: docs.scalarPath,
            swaggerPath: docs.swaggerPath,
        };
    }
}
