import { TUsersStatus } from '@localzet/aura-contract';

export class ChangeUserStatusCommand {
    constructor(
        public readonly userUuid: string,
        public readonly status: TUsersStatus,
    ) {
    }
}
