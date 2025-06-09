import { TResetPeriods, TUsersStatus } from '@libs/contracts/constants';

export class GetUsersByTrafficStrategyAndStatusQuery {
    constructor(
        public readonly strategy: TResetPeriods,
        public readonly status: TUsersStatus,
    ) {
    }
}
