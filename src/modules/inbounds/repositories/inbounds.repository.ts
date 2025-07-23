import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrud } from '@common/types/crud-port';

import { InboundsWithTagsAndType } from '../interfaces/inbounds-with-tags-and-type.interface';
import { GetInboundStatsByUuidBuilder } from '../builders/get-inbound-stats-by-uuid';
import { InboundStatsRaw, InboundWithStatsEntity } from '../entities';
import { InboundsConverter } from '../converters/inbounds.converter';
import { InboundsEntity } from '../entities/inbounds.entity';

@Injectable()
export class InboundsRepository implements ICrud<InboundsEntity> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly inboundsConverter: InboundsConverter,
    ) {}

    public async findAll(): Promise<InboundsEntity[]> {
        const inbounds = await this.prisma.tx.inbounds.findMany();
        return this.inboundsConverter.fromPrismaModelsToEntities(inbounds);
    }

    public async deleteMany(tags: string[]): Promise<number> {
        const result = await this.prisma.tx.inbounds.deleteMany({
            where: {
                tag: {
                    in: tags,
                },
            },
        });
        return result.count;
    }

    public async createMany(inbounds: InboundsWithTagsAndType[]): Promise<number> {
        const result = await this.prisma.tx.inbounds.createMany({
            data: inbounds,
        });
        return result.count;
    }

    public async create(entity: InboundsEntity): Promise<InboundsEntity> {
        const model = this.inboundsConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.inbounds.create({
            data: {
                ...model,
            },
        });

        return this.inboundsConverter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<InboundsEntity | null> {
        const result = await this.prisma.tx.inbounds.findUnique({
            where: { uuid },
        });
        if (!result) {
            return null;
        }
        return this.inboundsConverter.fromPrismaModelToEntity(result);
    }

    public async update({ uuid, ...data }: Partial<InboundsEntity>): Promise<InboundsEntity> {
        const model = this.inboundsConverter.fromEntityToPrismaModel({
            uuid,
            ...data,
        } as InboundsEntity);
        const result = await this.prisma.tx.inbounds.update({
            where: { uuid },
            data: {
                ...model,
            },
        });

        return this.inboundsConverter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(dto: Partial<InboundsEntity>): Promise<InboundsEntity[]> {
        const model = this.inboundsConverter.fromEntityToPrismaModel(dto as InboundsEntity);
        const list = await this.prisma.tx.inbounds.findMany({
            where: {
                ...model,
            },
        });
        return this.inboundsConverter.fromPrismaModelsToEntities(list);
    }

    public async findFirst(): Promise<InboundsEntity | null> {
        const result = await this.prisma.tx.inbounds.findFirst();
        if (!result) {
            return null;
        }
        return this.inboundsConverter.fromPrismaModelToEntity(result);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.tx.inbounds.delete({ where: { uuid } });
        return Boolean(result);
    }

    public async getInboundStatsByUuid(uuid: string): Promise<InboundWithStatsEntity | null> {
        const { query } = new GetInboundStatsByUuidBuilder(uuid);
        const result = await this.prisma.tx.$queryRaw<InboundStatsRaw[]>(query);

        if (result.length === 0) {
            return null;
        }

        return new InboundWithStatsEntity(result[0]);
    }
}
