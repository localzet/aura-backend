import { XrayConfig } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { UniversalConverter } from '@common/converter/universalConverter';

import { XrayConfigEntity } from './entities/xray-config.entity';

const modelToEntity = (model: XrayConfig): XrayConfigEntity => {
    return new XrayConfigEntity(model);
};

const entityToModel = (entity: XrayConfigEntity): XrayConfig => {
    return {
        uuid: entity.uuid,
        config: entity.config,
        updatedAt: entity.updatedAt,
    };
};

@Injectable()
export class XrayConfigConverter extends UniversalConverter<XrayConfigEntity, XrayConfig> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
