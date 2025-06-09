import { Prisma } from '@prisma/client';

import { USERS_STATUS } from '@libs/contracts/constants';

import { InboundsEntity } from '@modules/inbounds/entities';

export class UsersWithInboundTagBuilder {
    public query: Prisma.Sql;

    constructor() {
        this.query = this.getQuery();
        return this;
    }

    public getQuery(): Prisma.Sql {
        const query = `
        SELECT 
            u.subscription_uuid as "subscriptionUuid",
            u.username,
            u.trojan_password as "trojanPassword",
            u.vless_uuid as "vlessUuid",
            u.ss_password as "ssPassword",
            i.tag
        FROM users u
        INNER JOIN active_user_inbounds aui 
            ON aui.user_uuid = u.uuid
        INNER JOIN inbounds i 
            ON i.uuid = aui.inbound_uuid
        WHERE u.status = '${USERS_STATUS.ACTIVE}'
    `;

        return Prisma.raw(query);
    }
}

// export class UsersWithInboundTagAndExcludedInboundsBuilder {
//     public query: Prisma.Sql;
//     private excludedInbounds: InboundsEntity[];

//     constructor(excludedInbounds: InboundsEntity[]) {
//         this.excludedInbounds = excludedInbounds;
//         this.query = this.getQuery();
//         return this;
//     }

//     public getQuery(): Prisma.Sql {
//         const excludedUuidsCondition =
//             this.excludedInbounds.length > 0
//                 ? `AND i.uuid NOT IN (${this.excludedInbounds.map((inbound) => `'${inbound.uuid}'`).join(',')})`
//                 : '';

//         const query = `
//         SELECT
//             u.subscription_uuid as "subscriptionUuid",
//             u.username,
//             u.trojan_password as "trojanPassword",
//             u.vless_uuid as "vlessUuid",
//             u.ss_password as "ssPassword",
//             i.tag
//         FROM users u
//         INNER JOIN active_user_inbounds aui
//             ON aui.user_uuid = u.uuid
//         INNER JOIN inbounds i
//             ON i.uuid = aui.inbound_uuid
//         WHERE u.status = '${USERS_STATUS.ACTIVE}'
//             ${excludedUuidsCondition}
//         ORDER BY u.created_at ASC
//     `;

//         return Prisma.raw(query);
//     }
// }

export class UsersWithInboundTagAndExcludedInboundsBuilder {
    public query: Prisma.Sql;
    private excludedInbounds: InboundsEntity[];

    constructor(excludedInbounds: InboundsEntity[]) {
        this.excludedInbounds = excludedInbounds;
        this.query = this.getQuery();
        return this;
    }

    public getQuery(): Prisma.Sql {
        let excludedUuidsCondition = '';
        if (this.excludedInbounds.length > 0) {
            excludedUuidsCondition = `AND NOT EXISTS (
                SELECT 1
                FROM unnest(ARRAY[${this.excludedInbounds.map((inbound) => `'${inbound.uuid}'`).join(',')}]::UUID[]) ex
                WHERE ex = i.uuid
                )`;
        }

        const query = `
        SELECT
            u.username,
            u.trojan_password AS "trojanPassword",
            u.vless_uuid AS "vlessUuid",
            u.ss_password AS "ssPassword",
            tags.tag_array AS "tags"
        FROM
        users u
        CROSS JOIN LATERAL (
            SELECT
                array_agg(i.tag) AS tag_array
            FROM
                active_user_inbounds aui
                JOIN inbounds i ON i.uuid = aui.inbound_uuid
            WHERE
                aui.user_uuid = u.uuid
                ${excludedUuidsCondition}
            ) tags
        WHERE
            u.status = '${USERS_STATUS.ACTIVE}'
            AND tags.tag_array IS NOT NULL
        ORDER BY
            u.created_at ASC
            `;

        return Prisma.raw(query);
    }
}
