import { Prisma } from '@prisma/client';

export class SumLifetimeUsageBuilder {
    public query: Prisma.Sql;

    constructor() {
        this.query = this.getQuery();
        return this;
    }

    public getQuery(): Prisma.Sql {
        const query = `
        SELECT
            SUM(used_bytes) AS "usedTrafficBytes",
            user_uuid as "uuid"
        FROM
            "public"."user_traffic_history"
        GROUP BY
            user_uuid;
    `;

        return Prisma.raw(query);
    }
}
