import { TUsersStatus } from '@localzet/aura-contract';

export class UpdateStatusAndTrafficAndResetAtCommand {
    constructor(
        public readonly userUuid: string,
        public readonly lastResetAt: Date,
        public readonly status?: TUsersStatus,
    ) {
    }
}
