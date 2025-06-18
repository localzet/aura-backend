import { TUsersStatus } from '@localzet/aura-backend-contract/constants';

export class ChangeUserStatusCommand {
    constructor(
        public readonly userUuid: string,
        public readonly status: TUsersStatus,
    ) {
    }
}
