import { Prisma } from '@prisma/client';

export class BulkUpdateUserUsedTrafficBuilder {
    public query: Prisma.Sql;

    constructor(userUsageList: { u: string; b: string }[]) {
        this.query = this.getQuery(userUsageList);
        return this;
    }

    public getQuery(userUsageList: { u: string; b: string }[]): Prisma.Sql {
        const query = `
            WITH updated_users AS ( UPDATE "users" AS u
                SET
                    "used_traffic_bytes"          = u."used_traffic_bytes" + data."inc_used",
                    "lifetime_used_traffic_bytes" = u."lifetime_used_traffic_bytes" + data."inc_used",
                    "online_at"                   = NOW(),
                    "first_connected_at"          = COALESCE(u."first_connected_at", NOW()),
                    "updated_at"                  = NOW()
            FROM (
                VALUES ${userUsageList.map((usageHistory) => `(${usageHistory.b}::bigint, '${usageHistory.u}'::uuid)`).join(',')}
                ) AS data("inc_used", "uuid")
            WHERE data."uuid" = u."uuid"
            RETURNING
                u."uuid",
                (u."first_connected_at" = u."online_at") AS "isFirstConnection"
            )
            SELECT uuid
            FROM updated_users
            WHERE "isFirstConnection";
        `;
        return Prisma.raw(query);
    }
}
