import { Prisma } from '@prisma/client';

export class GetNodeUsersUsageByRangeBuilder {
    public query: Prisma.Sql;

    constructor(nodeUuid: string, start: Date, end: Date) {
        this.query = this.getQuery(nodeUuid, start, end);
        return this;
    }

    public getQuery(nodeUuid: string, start: Date, end: Date): Prisma.Sql {
        return Prisma.sql`
        SELECT
            DATE(h.created_at) AS "date",
            h.user_uuid as "userUuid",
            u.username as "username",
            h.node_uuid as "nodeUuid",
            COALESCE(SUM(h.total_bytes), 0) AS "total"
        FROM
            nodes_user_usage_history h
            JOIN users u ON h.user_uuid = u.uuid
        WHERE
            h.node_uuid = ${nodeUuid}::uuid
            AND h.created_at >= ${start}
            AND h.created_at <= ${end}
        GROUP BY
            "date",
            h.user_uuid,
            h.node_uuid,
            u.username
        ORDER BY
            "date" ASC
    `;
    }
}
