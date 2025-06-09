import { ILastConnectedNode } from '@modules/nodes-user-usage-history/interfaces';
import { InboundsEntity } from '@modules/inbounds/entities';

import { IUserWithActiveInboundsAndLastConnectedNode } from '../interfaces';
import { UserEntity } from './users.entity';

export class UserWithActiveInboundsAndLastConnectedNodeEntity extends UserEntity {
    activeUserInbounds: InboundsEntity[];
    lastConnectedNode: ILastConnectedNode | null;

    constructor(user: Partial<IUserWithActiveInboundsAndLastConnectedNode>) {
        super(user);
        if (user.activeUserInbounds) {
            this.activeUserInbounds = user.activeUserInbounds.map((item) => ({
                uuid: item.inbound.uuid,
                tag: item.inbound.tag,
                type: item.inbound.type,
                network: item.inbound.network,
                security: item.inbound.security,
            }));
        } else {
            this.activeUserInbounds = [];
        }

        if (user.nodesUserUsageHistory && user.nodesUserUsageHistory.length > 0) {
            this.lastConnectedNode = {
                nodeName: user.nodesUserUsageHistory[0].node.name,
                connectedAt: user.nodesUserUsageHistory[0].updatedAt,
            };
        } else {
            this.lastConnectedNode = null;
        }

        return this;
    }
}
