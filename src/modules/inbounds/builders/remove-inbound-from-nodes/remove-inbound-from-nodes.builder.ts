import { Prisma } from '@prisma/client';

export class RemoveInboundFromNodesBuilder {
    public query: Prisma.Sql;

    constructor(inboundUuid: string) {
        this.query = this.getQuery(inboundUuid);
    }

    public getQuery(inboundUuid: string): Prisma.Sql {
        const query = `
INSERT INTO "public"."node_inbound_exclusions" ("node_uuid", "inbound_uuid")
SELECT n."uuid", '${inboundUuid}'
FROM "public"."nodes" n
ON CONFLICT DO NOTHING;
    `;
        return Prisma.raw(query);
    }
}
