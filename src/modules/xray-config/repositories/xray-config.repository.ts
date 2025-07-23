import { Prisma } from '@prisma/client';

import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrud } from '@common/types/crud-port';

import { XrayConfigEntity } from '../entities/xray-config.entity';
import { XrayConfigConverter } from '../xray-config.converter';

@Injectable()
export class XrayConfigRepository implements ICrud<XrayConfigEntity> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly converter: XrayConfigConverter,
    ) {}

    public async create(entity: XrayConfigEntity): Promise<XrayConfigEntity> {
        const model = this.converter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.xrayConfig.create({
            data: {
                ...model,
                config: model.config as Prisma.InputJsonValue,
            },
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<null | XrayConfigEntity> {
        const result = await this.prisma.tx.xrayConfig.findUnique({
            where: { uuid },
        });
        if (!result) {
            return null;
        }
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async update({ uuid, ...data }: Partial<XrayConfigEntity>): Promise<XrayConfigEntity> {
        const model = this.converter.fromEntityToPrismaModel({ uuid, ...data } as XrayConfigEntity);
        const result = await this.prisma.tx.xrayConfig.update({
            where: { uuid },
            data: {
                ...model,
                config: model.config as Prisma.InputJsonValue,
            },
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(dto: Partial<XrayConfigEntity>): Promise<XrayConfigEntity[]> {
        const model = this.converter.fromEntityToPrismaModel(dto as XrayConfigEntity);
        const list = await this.prisma.tx.xrayConfig.findMany({
            where: {
                ...model,
                config: model.config
                    ? { equals: model.config as Prisma.InputJsonValue }
                    : undefined,
            },
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async findFirst(): Promise<null | XrayConfigEntity> {
        const result = await this.prisma.tx.xrayConfig.findFirst();
        if (!result) {
            return null;
        }
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.tx.xrayConfig.delete({ where: { uuid } });
        return Boolean(result);
    }
}
