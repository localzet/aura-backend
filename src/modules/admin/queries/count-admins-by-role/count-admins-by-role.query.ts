import { TRoleTypes } from '@localzet/aura-contract/constants';

export class CountAdminsByRoleQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
