import { Prisma } from '@prisma/client';

export class AddInboundToUsersBuilder {
    public query: Prisma.Sql;

    constructor(inboundUuid: string) {
        this.query = this.getQuery(inboundUuid);
        return this;
    }

    public getQuery(inboundUuid: string): Prisma.Sql {
        const query = `
INSERT INTO "public"."active_user_inbounds" ("user_uuid", "inbound_uuid")
SELECT u."uuid", '${inboundUuid}'
FROM "public"."users" u
ON CONFLICT ("user_uuid", "inbound_uuid") DO NOTHING;
    `;
        return Prisma.raw(query);
    }
}
