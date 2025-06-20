import { TRoleTypes } from '@localzet/aura-contract/constants';

export class GetAdminByUsernameQuery {
    constructor(
        public readonly username: string,
        public readonly role: TRoleTypes,
    ) {
    }
}
