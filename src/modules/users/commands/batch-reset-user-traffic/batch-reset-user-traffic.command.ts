import { TResetPeriods } from '@localzet/aura-contract/constants';

export class BatchResetUserTrafficCommand {
    constructor(public readonly strategy: TResetPeriods) {
    }
}
