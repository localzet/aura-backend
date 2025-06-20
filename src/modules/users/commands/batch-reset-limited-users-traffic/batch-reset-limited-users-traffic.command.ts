import { TResetPeriods } from '@localzet/aura-contract';

export class BatchResetLimitedUsersTrafficCommand {
    constructor(public readonly strategy: TResetPeriods) {
    }
}
