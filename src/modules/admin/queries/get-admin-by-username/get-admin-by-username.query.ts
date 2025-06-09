import { TRoleTypes } from '@libs/contracts/constants';

export class GetAdminByUsernameQuery {
    constructor(
        public readonly username: string,
        public readonly role: TRoleTypes,
    ) {
    }
}
