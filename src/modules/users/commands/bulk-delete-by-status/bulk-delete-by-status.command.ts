import { TUsersStatus } from '@localzet/aura-contract';

export class BulkDeleteByStatusCommand {
    constructor(
        public readonly status: TUsersStatus,
        public readonly limit?: number,
    ) {
    }
}
