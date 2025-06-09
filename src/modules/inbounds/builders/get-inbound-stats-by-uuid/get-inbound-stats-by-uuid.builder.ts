import { Prisma } from '@prisma/client';

export class GetInboundStatsByUuidBuilder {
    public query: Prisma.Sql;

    constructor(inboundUuid: string) {
        this.query = this.getQuery(inboundUuid);
        return this;
    }

    public getQuery(inboundUuid: string): Prisma.Sql {
        const query = `
WITH user_stats AS (
    SELECT 
        COUNT(DISTINCT aui.user_uuid) AS enabled_users,
        (SELECT COUNT(*) FROM users) - COUNT(DISTINCT aui.user_uuid) AS disabled_users
    FROM 
        active_user_inbounds aui
    WHERE 
        aui.inbound_uuid = '${inboundUuid}'
), 
node_stats AS (
    SELECT 
        -- Количество нод, у которых этот инбаунд включен (нет в exclusions)
        (SELECT COUNT(*) FROM nodes) - COUNT(DISTINCT nie.node_uuid) AS enabled_nodes,
        -- Количество нод, у которых этот инбаунд выключен (есть в exclusions)
        COUNT(DISTINCT nie.node_uuid) AS disabled_nodes
    FROM 
        node_inbound_exclusions nie
    WHERE 
        nie.inbound_uuid = '${inboundUuid}'
)
SELECT 
    i.uuid AS "uuid",
    i.tag AS "tag",
    i."security" as "security",
    i.network as "network",
    i.type as "type",
    COALESCE(us.enabled_users, 0) AS "enabledUsers",
    COALESCE(us.disabled_users, 0) AS "disabledUsers",
    COALESCE(ns.enabled_nodes, 0) AS "enabledNodes",
    COALESCE(ns.disabled_nodes, 0) AS "disabledNodes"
FROM 
    inbounds i
LEFT JOIN user_stats us ON TRUE
LEFT JOIN node_stats ns ON TRUE
WHERE 
    i.uuid = '${inboundUuid}';
    `;
        return Prisma.raw(query);
    }
}
