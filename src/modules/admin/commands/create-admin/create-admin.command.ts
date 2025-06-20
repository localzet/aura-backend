import { TRoleTypes } from '@localzet/aura-contract/constants';

export class CreateAdminCommand {
    constructor(
        public readonly username: string,
        public readonly password: string,
        public readonly role: TRoleTypes,
    ) {
    }
}
