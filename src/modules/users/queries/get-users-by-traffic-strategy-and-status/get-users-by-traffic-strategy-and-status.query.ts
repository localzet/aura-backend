import { TResetPeriods, TUsersStatus } from '@localzet/aura-contract';

export class GetUsersByTrafficStrategyAndStatusQuery {
    constructor(
        public readonly strategy: TResetPeriods,
        public readonly status: TUsersStatus,
    ) {
    }
}
