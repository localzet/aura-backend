import { TRoleTypes } from '@localzet/aura-contract/constants';

export class GetFirstAdminQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
