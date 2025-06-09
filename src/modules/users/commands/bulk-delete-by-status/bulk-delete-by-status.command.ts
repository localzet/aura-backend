import { TUsersStatus } from '@libs/contracts/constants';

export class BulkDeleteByStatusCommand {
    constructor(
        public readonly status: TUsersStatus,
        public readonly limit?: number,
    ) {
    }
}
