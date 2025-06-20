import { TRoleTypes } from '@localzet/aura-contract';

export class GetFirstAdminQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
