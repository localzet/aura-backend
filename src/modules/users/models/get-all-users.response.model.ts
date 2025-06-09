import { GetFullUserResponseModel } from './get-full-user.response.model';

export class GetAllUsersResponseModel {
    public readonly total: number;
    public readonly users: GetFullUserResponseModel[];

    constructor(data: GetAllUsersResponseModel) {
        this.total = data.total;
        this.users = data.users;
    }
}
