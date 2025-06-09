import { NodesUsageHistory } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { UniversalConverter } from '@common/converter/universalConverter';

import { NodesUsageHistoryEntity } from './entities/nodes-usage-history.entity';

const modelToEntity = (model: NodesUsageHistory): NodesUsageHistoryEntity => {
    return new NodesUsageHistoryEntity(model);
};

const entityToModel = (entity: NodesUsageHistoryEntity): NodesUsageHistory => {
    return {
        nodeUuid: entity.nodeUuid,
        downloadBytes: entity.downloadBytes,
        uploadBytes: entity.uploadBytes,
        totalBytes: entity.totalBytes,
        createdAt: entity.createdAt,
    };
};

@Injectable()
export class NodesUsageHistoryConverter extends UniversalConverter<
    NodesUsageHistoryEntity,
    NodesUsageHistory
> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
