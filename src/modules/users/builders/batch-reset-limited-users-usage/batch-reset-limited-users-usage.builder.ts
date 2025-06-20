import { Prisma } from '@prisma/client';

import { TResetPeriods, USERS_STATUS } from '@localzet/aura-contract/constants';

export class BatchResetLimitedUsersUsageBuilder {
    public query: Prisma.Sql;

    constructor(strategy: TResetPeriods) {
        this.query = this.getQuery(strategy);
        return this;
    }

    public getQuery(strategy: TResetPeriods): Prisma.Sql {
        const query = `
        WITH users_to_reset AS (
            SELECT uuid, used_traffic_bytes 
                FROM users 
                WHERE traffic_limit_strategy = '${strategy.toUpperCase()}'
                AND status = '${USERS_STATUS.LIMITED.toUpperCase()}'
            ),
            insert_history AS (
                INSERT INTO user_traffic_history (user_uuid, used_bytes)
                SELECT uuid, used_traffic_bytes
                FROM users_to_reset
            )
        UPDATE users 
        SET used_traffic_bytes = 0,
            last_traffic_reset_at = NOW(),
            status = '${USERS_STATUS.ACTIVE.toUpperCase()}'
        WHERE uuid IN (SELECT uuid FROM users_to_reset)
        RETURNING uuid;
    `;
        return Prisma.raw(query);
    }
}
