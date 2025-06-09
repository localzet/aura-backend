import { Prisma } from '@prisma/client';

import {
    NodesUserUsageHistoryEntity,
} from '@modules/nodes-user-usage-history/entities/nodes-user-usage-history.entity';

export class BulkUpsertHistoryEntryBuilder {
    public query: Prisma.Sql;

    constructor(usageHistoryList: NodesUserUsageHistoryEntity[]) {
        this.query = this.getQuery(usageHistoryList);
        return this;
    }

    public getQuery(usageHistoryList: NodesUserUsageHistoryEntity[]): Prisma.Sql {
        const date = new Date(new Date().setMinutes(0, 0, 0));

        const query = `
        INSERT INTO nodes_user_usage_history (
            "node_uuid",
            "user_uuid",
            "download_bytes",
            "upload_bytes",
            "total_bytes",
            "created_at",
            "updated_at"
        ) VALUES ${usageHistoryList.map((usageHistory) => `('${usageHistory.nodeUuid}', '${usageHistory.userUuid}', ${usageHistory.downloadBytes}, ${usageHistory.uploadBytes}, ${usageHistory.totalBytes}, '${date.toISOString()}', NOW())`).join(',')}
        ON CONFLICT ("node_uuid","user_uuid","created_at")
        DO UPDATE
            SET
                "download_bytes" = "nodes_user_usage_history"."download_bytes" + EXCLUDED."download_bytes",
                "upload_bytes"   = "nodes_user_usage_history"."upload_bytes"   + EXCLUDED."upload_bytes",
                "total_bytes"    = "nodes_user_usage_history"."total_bytes"    + EXCLUDED."total_bytes",
                "updated_at"     = EXCLUDED."updated_at"
    `;
        return Prisma.raw(query);
    }
}
