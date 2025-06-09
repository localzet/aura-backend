import { Prisma } from '@prisma/client';

export class UsersLastConnectedNodeBuilder {
    public query: Prisma.Sql;

    constructor(userUuids: string[]) {
        this.query = this.getQuery(userUuids);
        return this;
    }

    public getQuery(userUuids: string[]): Prisma.Sql {
        const query = Prisma.sql`
            SELECT DISTINCT ON ("user_uuid")
                "user_uuid" as "userUuid", 
                "node"."name" as "nodeName", 
                "nodes_user_usage_history"."updated_at" as "connectedAt"
            FROM "nodes_user_usage_history"
            JOIN "nodes" as "node" ON "node"."uuid" = "nodes_user_usage_history"."node_uuid"
            WHERE "user_uuid" = ANY(ARRAY[${Prisma.join(userUuids)}]::uuid[])
            ORDER BY "user_uuid", "nodes_user_usage_history"."updated_at" DESC
    `;

        return query;
    }
}

export class UserLastConnectedNodeBuilder {
    public query: Prisma.Sql;

    constructor(userUuid: string) {
        this.query = this.getQuery(userUuid);
        return this;
    }

    public getQuery(userUuid: string): Prisma.Sql {
        const query = Prisma.sql`
            SELECT DISTINCT ON ("user_uuid")
                "user_uuid" as "userUuid", 
                "node"."name" as "nodeName", 
                "nodes_user_usage_history"."updated_at" as "connectedAt"
            FROM "nodes_user_usage_history"
            JOIN "nodes" as "node" ON "node"."uuid" = "nodes_user_usage_history"."node_uuid"
            WHERE "user_uuid" = ${userUuid}::uuid
            ORDER BY "user_uuid", "nodes_user_usage_history"."updated_at" DESC
    `;

        return query;
    }
}
