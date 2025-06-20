import { TResetPeriods, TUsersStatus } from '@localzet/aura-contract/constants';

export class GetUsersByTrafficStrategyAndStatusQuery {
    constructor(
        public readonly strategy: TResetPeriods,
        public readonly status: TUsersStatus,
    ) {
    }
}
