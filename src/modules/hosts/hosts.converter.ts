import { Hosts } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { UniversalConverter } from '@common/converter/universalConverter';

import { HostsEntity } from './entities/hosts.entity';

const modelToEntity = (model: Hosts): HostsEntity => {
    return new HostsEntity(model);
};

const entityToModel = (entity: HostsEntity): Hosts => {
    return {
        uuid: entity.uuid,
        inboundUuid: entity.inboundUuid,
        viewPosition: entity.viewPosition,
        remark: entity.remark,
        address: entity.address,
        port: entity.port,
        path: entity.path,
        sni: entity.sni,
        host: entity.host,
        alpn: entity.alpn,
        fingerprint: entity.fingerprint,
        securityLayer: entity.securityLayer,
        allowInsecure: entity.allowInsecure,
        isDisabled: entity.isDisabled,
        xHttpExtraParams: entity.xHttpExtraParams,
    };
};

@Injectable()
export class HostsConverter extends UniversalConverter<HostsEntity, Hosts> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
