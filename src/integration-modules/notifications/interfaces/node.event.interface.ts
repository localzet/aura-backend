import { TNodeEvents } from '@localzet/aura-contract/constants';

import { NodesEntity } from '@modules/nodes/entities/nodes.entity';

export class NodeEvent {
    node: NodesEntity;
    eventName: TNodeEvents;

    constructor(node: NodesEntity, event: TNodeEvents) {
        this.node = node;
        this.eventName = event;
    }
}
