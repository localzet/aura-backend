import { InboundsEntity } from '@modules/inbounds/entities';

import { IUserWithActiveInbounds } from '../interfaces';
import { UserEntity } from './users.entity';

export class UserWithActiveInboundsEntity extends UserEntity {
    activeUserInbounds: InboundsEntity[];

    constructor(user: Partial<IUserWithActiveInbounds>) {
        super(user);
        if (user.activeUserInbounds) {
            this.activeUserInbounds = user.activeUserInbounds.map((item) => ({
                uuid: item.inbound.uuid,
                tag: item.inbound.tag,
                type: item.inbound.type,
                network: item.inbound.network,
                security: item.inbound.security,
            }));
        }
        return this;
    }
}
