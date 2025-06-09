import { ApiTokenEntity } from '../entities/api-token.entity';

export class CreateApiTokenResponseModel {
    public readonly token: string;
    public readonly uuid: string;

    constructor(data: ApiTokenEntity) {
        this.token = data.token;
        this.uuid = data.uuid;
    }
}
