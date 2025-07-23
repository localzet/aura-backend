import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrud } from '@common/types/crud-port';

import { NodesEntity } from '../entities/nodes.entity';
import { NodesConverter } from '../nodes.converter';
import { IReorderNode } from '../interfaces';

const ADD_EXCLUSIONS_SELECT = {
    inboundsExclusions: {
        select: {
            inbound: {
                select: {
                    uuid: true,
                    tag: true,
                    type: true,
                    network: true,
                    security: true,
                },
            },
        },
    },
} as const;

@Injectable()
export class NodesRepository implements ICrud<NodesEntity> {
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly nodesConverter: NodesConverter,
    ) {
    }

    public async create(entity: NodesEntity): Promise<NodesEntity> {
        const model = this.nodesConverter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.nodes.create({
            data: model,
            include: ADD_EXCLUSIONS_SELECT,
        });

        return new NodesEntity(result);
    }

    public async findConnectedNodes(): Promise<NodesEntity[]> {
        const nodesList = await this.prisma.tx.nodes.findMany({
            where: {
                isConnected: true,
                isXrayRunning: true,
                isNodeOnline: true,
                isDisabled: false,
            },
            include: ADD_EXCLUSIONS_SELECT,
        });

        return nodesList.map((value) => new NodesEntity(value));
    }

    public async findAllNodes(): Promise<NodesEntity[]> {
        const nodesList = await this.prisma.tx.nodes.findMany({
            include: ADD_EXCLUSIONS_SELECT,
        });

        return nodesList.map((value) => new NodesEntity(value));
    }

    public async incrementUsedTraffic(nodeUuid: string, bytes: bigint): Promise<void> {
        await this.prisma.tx.nodes.update({
            where: { uuid: nodeUuid },
            data: { trafficUsedBytes: { increment: bytes } },
        });
    }

    public async findByUUID(uuid: string): Promise<NodesEntity | null> {
        const result = await this.prisma.tx.nodes.findUnique({
            where: { uuid },
            include: ADD_EXCLUSIONS_SELECT,
        });
        if (!result) {
            return null;
        }
        return new NodesEntity(result);
    }

    public async update({ uuid, ...data }: Partial<NodesEntity>): Promise<NodesEntity> {
        const result = await this.prisma.tx.nodes.update({
            where: {
                uuid,
            },
            data,
            include: ADD_EXCLUSIONS_SELECT,
        });

        return new NodesEntity(result);
    }

    public async findByCriteria(dto: Partial<NodesEntity>): Promise<NodesEntity[]> {
        const nodesList = await this.prisma.tx.nodes.findMany({
            where: dto,
            orderBy: {
                viewPosition: 'asc',
            },
            include: ADD_EXCLUSIONS_SELECT,
        });
        return nodesList.map((value) => new NodesEntity(value));
    }

    public async findFirstByCriteria(dto: Partial<NodesEntity>): Promise<NodesEntity | null> {
        const result = await this.prisma.tx.nodes.findFirst({
            where: dto,
            include: ADD_EXCLUSIONS_SELECT,
        });

        if (!result) {
            return null;
        }

        return new NodesEntity(result);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.tx.nodes.delete({ where: { uuid } });
        return Boolean(result);
    }

    public async reorderMany(dto: IReorderNode[]): Promise<boolean> {
        await this.prisma.withTransaction(async () => {
            for (const { uuid, viewPosition } of dto) {
                await this.prisma.tx.nodes.updateMany({
                    where: { uuid },
                    data: { viewPosition },
                });
            }
        });

        await this.prisma.tx
            .$executeRaw`SELECT setval('nodes_view_position_seq', (SELECT MAX(view_position) FROM nodes) + 1)`;

        return true;
    }
}
