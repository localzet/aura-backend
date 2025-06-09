import { Prisma } from '@prisma/client';

export class TriggerThresholdNotificationsBuilder {
    public query: Prisma.Sql;

    constructor(private readonly percentages: number[]) {
        this.query = this.getQuery(this.percentages);
        return this;
    }

    public getQuery(percentages: number[]): Prisma.Sql {
        const pctValues = percentages.map((p) => `(${p})`).join(',');

        return Prisma.raw(`
        WITH thresholds(pct) AS (VALUES ${pctValues}),
        candidates AS (
            SELECT
                u."uuid",
                MAX(t.pct) AS new_threshold
            FROM "users" u
            JOIN thresholds t
                ON u."status" = 'ACTIVE'
                AND u."traffic_limit_bytes" > 0
                AND u."used_traffic_bytes" >= u."traffic_limit_bytes" * t.pct / 100
                AND u."last_triggered_threshold"   < t.pct
            GROUP BY u."uuid"
            ORDER BY u."created_at"
            LIMIT 5000
            )
        UPDATE "users" AS u
        SET "last_triggered_threshold" = c.new_threshold,
            "updated_at"               = NOW()
        FROM candidates c
        WHERE u."uuid" = c."uuid"
        RETURNING u."uuid";
        `);
    }
}
