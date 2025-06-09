import { TRoleTypes } from '@libs/contracts/constants';

export class CreateAdminCommand {
    constructor(
        public readonly username: string,
        public readonly password: string,
        public readonly role: TRoleTypes,
    ) {
    }
}
