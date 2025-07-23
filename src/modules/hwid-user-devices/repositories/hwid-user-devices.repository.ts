import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrudWithStringId } from '@common/types/crud-port';

import { HwidUserDeviceEntity } from '../entities/hwid-user-device.entity';
import { HwidUserDevicesConverter } from '../hwid-user-devices.converter';

@Injectable()
export class HwidUserDevicesRepository
    implements Omit<ICrudWithStringId<HwidUserDeviceEntity>, 'deleteById' | 'findById' | 'update'>
{
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly converter: HwidUserDevicesConverter,
    ) {}

    public async create(entity: HwidUserDeviceEntity): Promise<HwidUserDeviceEntity> {
        const model = this.converter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.hwidUserDevices.create({
            data: model,
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async upsert(entity: HwidUserDeviceEntity): Promise<HwidUserDeviceEntity> {
        const model = this.converter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.hwidUserDevices.upsert({
            where: { hwid_userUuid: { hwid: entity.hwid, userUuid: entity.userUuid } },
            update: model,
            create: model,
        });

        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(
        dto: Partial<HwidUserDeviceEntity>,
    ): Promise<HwidUserDeviceEntity[]> {
        const list = await this.prisma.tx.hwidUserDevices.findMany({
            where: dto,
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async countByUserUuid(userUuid: string): Promise<number> {
        return await this.prisma.tx.hwidUserDevices.count({
            where: { userUuid },
        });
    }

    public async checkHwidExists(hwid: string, userUuid: string): Promise<boolean> {
        const count = await this.prisma.tx.hwidUserDevices.count({
            where: { hwid, userUuid },
        });
        return count > 0;
    }

    public async deleteByHwidAndUserUuid(hwid: string, userUuid: string): Promise<boolean> {
        const result = await this.prisma.tx.hwidUserDevices.delete({
            where: { hwid_userUuid: { hwid, userUuid } },
        });
        return Boolean(result);
    }
}
