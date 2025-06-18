import { TRoleTypes } from '@localzet/aura-backend-contract/constants';

export class GetFirstAdminQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
