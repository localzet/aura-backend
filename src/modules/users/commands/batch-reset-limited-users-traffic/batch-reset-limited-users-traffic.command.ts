import { TResetPeriods } from '@libs/contracts/constants';

export class BatchResetLimitedUsersTrafficCommand {
    constructor(public readonly strategy: TResetPeriods) {
    }
}
