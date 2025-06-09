import { Prisma } from '@prisma/client';

export class RemoveInboundsFromUsersByUuidsBuilder {
    public query: Prisma.Sql;

    constructor(userUuids: string[]) {
        this.query = this.getQuery(userUuids);
        return this;
    }

    public getQuery(userUuids: string[]): Prisma.Sql {
        const query = Prisma.sql`
        DELETE FROM public.active_user_inbounds
        WHERE user_uuid = ANY(ARRAY[${Prisma.join(userUuids)}]::uuid[]);
    `;

        return query;
    }
}
