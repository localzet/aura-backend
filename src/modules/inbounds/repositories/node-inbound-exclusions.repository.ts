import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { ICrud } from '@common/types/crud-port';

import { RemoveInboundFromNodesBuilder } from '../builders/remove-inbound-from-nodes';
import { AddInboundToNodesBuilder } from '../builders/add-inbound-to-nodes';
import { NodeInboundExclusionEntity } from '../entities';

@Injectable()
export class NodeInboundExclusionsRepository
    implements Omit<
        ICrud<NodeInboundExclusionEntity>,
        'create' | 'deleteByUUID' | 'findByCriteria' | 'findByUUID' | 'update'
    > {
    constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {
    }

    @Transactional()
    public async setExcludedInbounds(nodeUuid: string, inboundUuids: string[]): Promise<number> {
        await this.prisma.tx.nodeInboundExclusions.deleteMany({
            where: {
                nodeUuid,
            },
        });

        if (inboundUuids.length > 0) {
            const result = await this.prisma.tx.nodeInboundExclusions.createMany({
                data: inboundUuids.map((inboundUuid) => ({ nodeUuid, inboundUuid })),
                skipDuplicates: true,
            });
            return result.count;
        }
        return 0;
    }

    public async addInboundToNodes(uuid: string): Promise<number> {
        const { query } = new AddInboundToNodesBuilder(uuid);
        const result = await this.prisma.tx.$executeRaw<number>(query);

        return result;
    }

    public async removeInboundFromNodes(uuid: string): Promise<number> {
        const { query } = new RemoveInboundFromNodesBuilder(uuid);
        const result = await this.prisma.tx.$executeRaw<number>(query);

        return result;
    }
}
