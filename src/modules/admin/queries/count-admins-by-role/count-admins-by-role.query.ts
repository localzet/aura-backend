import { TRoleTypes } from '@localzet/aura-backend-contract/constants';

export class CountAdminsByRoleQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
