import { TResetPeriods } from '@localzet/aura-contract/constants';

export class BatchResetLimitedUsersTrafficCommand {
    constructor(public readonly strategy: TResetPeriods) {
    }
}
