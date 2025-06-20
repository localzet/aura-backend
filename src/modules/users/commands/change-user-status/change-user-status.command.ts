import { TUsersStatus } from '@localzet/aura-contract/constants';

export class ChangeUserStatusCommand {
    constructor(
        public readonly userUuid: string,
        public readonly status: TUsersStatus,
    ) {
    }
}
