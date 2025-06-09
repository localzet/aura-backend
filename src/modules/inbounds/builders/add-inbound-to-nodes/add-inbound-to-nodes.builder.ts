import { Prisma } from '@prisma/client';

export class AddInboundToNodesBuilder {
    public query: Prisma.Sql;

    constructor(inboundUuid: string) {
        this.query = this.getQuery(inboundUuid);
        return this;
    }

    public getQuery(inboundUuid: string): Prisma.Sql {
        const query = `
DELETE FROM "public"."node_inbound_exclusions"
WHERE "inbound_uuid" = '${inboundUuid}';
    `;
        return Prisma.raw(query);
    }
}
