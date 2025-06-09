import { NodeInboundExclusions } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { UniversalConverter } from '@common/converter/universalConverter';

import { NodeInboundExclusionEntity } from '../entities';

const modelToEntity = (model: NodeInboundExclusions): NodeInboundExclusionEntity => {
    return new NodeInboundExclusionEntity(model);
};

const entityToModel = (entity: NodeInboundExclusionEntity): NodeInboundExclusions => {
    return {
        nodeUuid: entity.nodeUuid,
        inboundUuid: entity.inboundUuid,
    };
};

@Injectable()
export class NodeInboundExclusionsConverter extends UniversalConverter<
    NodeInboundExclusionEntity,
    NodeInboundExclusions
> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
