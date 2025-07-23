import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrudWithId } from '@common/types/crud-port';

import { UserTrafficHistoryEntity } from '../entities/user-traffic-history.entity';
import { UserTrafficHistoryConverter } from '../user-traffic-history.converter';

@Injectable()
export class UserTrafficHistoryRepository implements ICrudWithId<UserTrafficHistoryEntity> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly converter: UserTrafficHistoryConverter,
    ) {
    }

    public async create(entity: UserTrafficHistoryEntity): Promise<UserTrafficHistoryEntity> {
        const model = this.converter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.userTrafficHistory.create({
            data: model,
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findById(id: bigint | number): Promise<null | UserTrafficHistoryEntity> {
        const result = await this.prisma.tx.userTrafficHistory.findUnique({
            where: { id },
        });
        if (!result) {
            return null;
        }
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async update({
                            id,
                            ...data
                        }: Partial<UserTrafficHistoryEntity>): Promise<UserTrafficHistoryEntity> {
        const result = await this.prisma.tx.userTrafficHistory.update({
            where: {
                id,
            },
            data,
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(
        dto: Partial<UserTrafficHistoryEntity>,
    ): Promise<UserTrafficHistoryEntity[]> {
        const list = await this.prisma.tx.userTrafficHistory.findMany({
            where: dto,
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async deleteById(id: bigint | number): Promise<boolean> {
        const result = await this.prisma.tx.userTrafficHistory.delete({ where: { id } });
        return Boolean(result);
    }
}
