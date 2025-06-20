import { TResetPeriods } from '@localzet/aura-contract';

export class BatchResetUserTrafficCommand {
    constructor(public readonly strategy: TResetPeriods) {
    }
}
