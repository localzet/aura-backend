import { UserWithActiveInboundsEntity } from '../../../users/entities/user-with-active-inbounds.entity';

export class AddUserToNodeEvent {
    constructor(public readonly user: UserWithActiveInboundsEntity) {
    }
}
