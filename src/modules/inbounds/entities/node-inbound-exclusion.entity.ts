import { NodeInboundExclusions } from '@prisma/client';

export class NodeInboundExclusionEntity implements NodeInboundExclusions {
    nodeUuid: string;
    inboundUuid: string;

    constructor(nodeInboundExclusion: Partial<NodeInboundExclusions>) {
        Object.assign(this, nodeInboundExclusion);
        return this;
    }
}
