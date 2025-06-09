import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrudWithId } from '@common/types/crud-port';

import { RemoveInboundsFromUsersByUuidsBuilder } from '../builders/remove-inbounds-from-users-by-uuids';
import { AddInboundsToUsersByUuidsBuilder } from '../builders/add-inbounds-to-users-by-uuids';
import { ActiveUserInboundsConverter } from '../converters/active-user-inbounds.converter';
import { RemoveInboundFromUsersBuilder } from '../builders/remove-inbound-from-users';
import { ActiveUserInboundEntity } from '../entities/active-user-inbound.entity';
import { AddInboundToUsersBuilder } from '../builders/add-inbound-to-users';

@Injectable()
export class ActiveUserInboundsRepository
    implements Omit<ICrudWithId<ActiveUserInboundEntity>, 'findById' | 'deleteById' | 'update'> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly activeUserInboundsConverter: ActiveUserInboundsConverter,
    ) {
    }

    public async findAll(): Promise<ActiveUserInboundEntity[]> {
        const activeUserInbounds = await this.prisma.tx.activeUserInbounds.findMany();
        return this.activeUserInboundsConverter.fromPrismaModelsToEntities(activeUserInbounds);
    }

    public async deleteMany(userUuids: string[]): Promise<number> {
        const result = await this.prisma.tx.activeUserInbounds.deleteMany({
            where: {
                userUuid: {
                    in: userUuids,
                },
            },
        });
        return result.count;
    }

    public async deleteManyActiveByUserUuid(userUuid: string): Promise<number> {
        const result = await this.prisma.tx.activeUserInbounds.deleteMany({
            where: {
                userUuid,
            },
        });
        return result.count;
    }

    public async createMany(userUuid: string, inboundUuids: string[]): Promise<number> {
        const result = await this.prisma.tx.activeUserInbounds.createMany({
            data: inboundUuids.map((inboundUuid) => ({ userUuid, inboundUuid })),
            skipDuplicates: true,
        });
        return result.count;
    }

    public async getActiveInboundsTags(userUuid: string): Promise<string[]> {
        const result = await this.prisma.tx.activeUserInbounds.findMany({
            where: { userUuid },
            include: {
                inbound: true,
            },
        });
        return result.map((item) => item.inbound.tag);
    }

    public async create(entity: ActiveUserInboundEntity): Promise<ActiveUserInboundEntity> {
        const model = this.activeUserInboundsConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.activeUserInbounds.create({
            data: {
                ...model,
            },
        });

        return this.activeUserInboundsConverter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(
        dto: Partial<ActiveUserInboundEntity>,
    ): Promise<ActiveUserInboundEntity[]> {
        const model = this.activeUserInboundsConverter.fromEntityToPrismaModel(
            dto as ActiveUserInboundEntity,
        );
        const list = await this.prisma.tx.activeUserInbounds.findMany({
            where: {
                ...model,
            },
        });
        return this.activeUserInboundsConverter.fromPrismaModelsToEntities(list);
    }

    public async findFirst(): Promise<ActiveUserInboundEntity | null> {
        const result = await this.prisma.tx.activeUserInbounds.findFirst();
        if (!result) {
            return null;
        }
        return this.activeUserInboundsConverter.fromPrismaModelToEntity(result);
    }

    public async addInboundToUsers(uuid: string): Promise<number> {
        const { query } = new AddInboundToUsersBuilder(uuid);
        const result = await this.prisma.tx.$executeRaw<number>(query);

        return result;
    }

    public async removeInboundFromUsers(uuid: string): Promise<number> {
        const { query } = new RemoveInboundFromUsersBuilder(uuid);
        const result = await this.prisma.tx.$executeRaw<number>(query);

        return result;
    }

    public async removeInboundsFromUsersByUuids(userUuids: string[]): Promise<number> {
        const { query } = new RemoveInboundsFromUsersByUuidsBuilder(userUuids);
        const result = await this.prisma.tx.$executeRaw<number>(query);

        return result;
    }

    public async addInboundsToUsersByUuids(
        userUuids: string[],
        inboundUuids: string[],
    ): Promise<number> {
        const { query } = new AddInboundsToUsersByUuidsBuilder(userUuids, inboundUuids);
        const result = await this.prisma.tx.$executeRaw<number>(query);

        return result;
    }
}
