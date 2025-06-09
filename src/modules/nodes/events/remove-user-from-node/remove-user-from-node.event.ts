import { UserWithActiveInboundsEntity } from '../../../users/entities/user-with-active-inbounds.entity';

export class RemoveUserFromNodeEvent {
    constructor(public readonly user: UserWithActiveInboundsEntity) {
    }
}
