import { Prisma } from '@prisma/client';

export class RemoveInboundFromUsersBuilder {
    public query: Prisma.Sql;

    constructor(inboundUuid: string) {
        this.query = this.getQuery(inboundUuid);
        return this;
    }

    public getQuery(inboundUuid: string): Prisma.Sql {
        const query = Prisma.sql`
DELETE FROM "public"."active_user_inbounds"
WHERE "inbound_uuid" = ${inboundUuid}::uuid;
    `;
        return query;
    }
}
