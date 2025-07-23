import { Prisma } from '@prisma/client';

import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrud } from '@common/types/crud-port';

import { SubscriptionSettingsEntity } from '../entities/subscription-settings.entity';
import { SubscriptionSettingsConverter } from '../subscription-settings.converter';

@Injectable()
export class SubscriptionSettingsRepository implements ICrud<SubscriptionSettingsEntity> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly converter: SubscriptionSettingsConverter,
    ) {
    }

    public async create(entity: SubscriptionSettingsEntity): Promise<SubscriptionSettingsEntity> {
        const model = this.converter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.subscriptionSettings.create({
            data: {
                ...model,
                expiredUsersRemarks: model.expiredUsersRemarks as Prisma.InputJsonValue,
                limitedUsersRemarks: model.limitedUsersRemarks as Prisma.InputJsonValue,
                disabledUsersRemarks: model.disabledUsersRemarks as Prisma.InputJsonValue,
                customResponseHeaders: model.customResponseHeaders as Prisma.InputJsonValue,
            },
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<null | SubscriptionSettingsEntity> {
        const result = await this.prisma.tx.subscriptionSettings.findUnique({
            where: { uuid },
        });
        if (!result) {
            return null;
        }
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async update({
                            uuid,
                            ...data
                        }: Partial<SubscriptionSettingsEntity>): Promise<SubscriptionSettingsEntity> {
        const model = this.converter.fromEntityToPrismaModel({
            uuid,
            ...data,
        } as SubscriptionSettingsEntity);
        const result = await this.prisma.tx.subscriptionSettings.update({
            where: { uuid },
            data: {
                ...model,
                expiredUsersRemarks: model.expiredUsersRemarks as Prisma.InputJsonValue,
                limitedUsersRemarks: model.limitedUsersRemarks as Prisma.InputJsonValue,
                disabledUsersRemarks: model.disabledUsersRemarks as Prisma.InputJsonValue,
                customResponseHeaders: model.customResponseHeaders as Prisma.InputJsonValue,
            },
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(
        dto: Partial<SubscriptionSettingsEntity>,
    ): Promise<SubscriptionSettingsEntity[]> {
        const model = this.converter.fromEntityToPrismaModel(dto as SubscriptionSettingsEntity);
        const list = await this.prisma.tx.subscriptionSettings.findMany({
            where: {
                ...model,
                expiredUsersRemarks: model.expiredUsersRemarks
                    ? { equals: model.expiredUsersRemarks as Prisma.InputJsonValue }
                    : undefined,
                limitedUsersRemarks: model.limitedUsersRemarks
                    ? { equals: model.limitedUsersRemarks as Prisma.InputJsonValue }
                    : undefined,
                disabledUsersRemarks: model.disabledUsersRemarks
                    ? { equals: model.disabledUsersRemarks as Prisma.InputJsonValue }
                    : undefined,
                customResponseHeaders: model.customResponseHeaders
                    ? { equals: model.customResponseHeaders as Prisma.InputJsonValue }
                    : undefined,
            },
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async findFirst(): Promise<null | SubscriptionSettingsEntity> {
        const result = await this.prisma.tx.subscriptionSettings.findFirst();
        if (!result) {
            return null;
        }
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.tx.subscriptionSettings.delete({ where: { uuid } });
        return Boolean(result);
    }
}
