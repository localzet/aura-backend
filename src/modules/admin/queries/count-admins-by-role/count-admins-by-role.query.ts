import { TRoleTypes } from '@libs/contracts/constants';

export class CountAdminsByRoleQuery {
    constructor(public readonly role: TRoleTypes) {
    }
}
