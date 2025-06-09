import { ILastConnectedNode } from '@modules/nodes-user-usage-history/interfaces';

import { UserWithActiveInboundsEntity } from '../entities/user-with-active-inbounds.entity';

export interface IGetUserWithLastConnectedNode {
    user: UserWithActiveInboundsEntity;
    lastConnectedNode: ILastConnectedNode | null;
}
