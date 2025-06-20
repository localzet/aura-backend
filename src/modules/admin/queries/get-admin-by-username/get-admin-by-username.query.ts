import { TRoleTypes } from '@localzet/aura-contract';

export class GetAdminByUsernameQuery {
    constructor(
        public readonly username: string,
        public readonly role: TRoleTypes,
    ) {
    }
}
