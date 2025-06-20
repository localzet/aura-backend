import { Prisma } from '@prisma/client';

import { TUsersStatus } from '@localzet/aura-contract';

export class BulkDeleteByStatusBuilder {
    public query: Prisma.Sql;

    constructor(status: TUsersStatus, limit: number = 30000) {
        this.query = this.getQuery(status, limit);
        return this;
    }

    public getQuery(status: TUsersStatus, limit: number): Prisma.Sql {
        const query = `
        DELETE FROM users
        WHERE "uuid" IN (
            SELECT "uuid" FROM users 
            WHERE "status" = '${status}' 
            LIMIT ${limit}
        );
    `;
        return Prisma.raw(query);
    }
}
