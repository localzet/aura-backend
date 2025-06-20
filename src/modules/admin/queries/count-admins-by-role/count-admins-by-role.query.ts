import { TRoleTypes } from '@localzet/aura-contract';

export class CountAdminsByRoleQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
