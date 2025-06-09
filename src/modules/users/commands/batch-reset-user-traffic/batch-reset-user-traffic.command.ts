import { TResetPeriods } from '@libs/contracts/constants';

export class BatchResetUserTrafficCommand {
    constructor(public readonly strategy: TResetPeriods) {
    }
}
