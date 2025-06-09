import { Prisma } from '@prisma/client';

export class GetUserUsageByRangeBuilder {
    public query: Prisma.Sql;

    constructor(userUuid: string, start: Date, end: Date) {
        this.query = this.getQuery(userUuid, start, end);
        return this;
    }

    public getQuery(userUuid: string, start: Date, end: Date): Prisma.Sql {
        return Prisma.sql`
            SELECT
                DATE(h.created_at) AS "date",
                h.user_uuid as "userUuid",
                h.node_uuid as "nodeUuid",
                n.name AS "nodeName",
                COALESCE(SUM(h.total_bytes), 0) AS "total"
            FROM
                nodes_user_usage_history h
                JOIN nodes n ON h.node_uuid = n.uuid
            WHERE
                h.user_uuid = ${userUuid}::uuid
                AND h.created_at >= ${start}
                AND h.created_at <= ${end}
            GROUP BY
                "date",
                h.user_uuid,
                h.node_uuid,
                n.name
            ORDER BY
                "date" ASC
        `;
    }
}
