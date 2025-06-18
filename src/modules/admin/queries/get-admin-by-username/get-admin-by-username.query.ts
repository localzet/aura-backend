import { TRoleTypes } from '@localzet/aura-backend-contract/constants';

export class GetAdminByUsernameQuery {
    constructor(
        public readonly username: string,
        public readonly role: TRoleTypes,
    ) {
    }
}
