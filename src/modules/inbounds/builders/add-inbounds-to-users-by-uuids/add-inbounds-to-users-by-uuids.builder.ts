import { Prisma } from '@prisma/client';

export class AddInboundsToUsersByUuidsBuilder {
    public query: Prisma.Sql;

    constructor(userUuids: string[], inboundUuids: string[]) {
        this.query = this.getQuery(userUuids, inboundUuids);
        return this;
    }

    public getQuery(userUuids: string[], inboundUuids: string[]): Prisma.Sql {
        const values = userUuids.flatMap((userUuid) =>
            inboundUuids.map(
                (inboundUuid) => Prisma.sql`(${userUuid}::uuid, ${inboundUuid}::uuid)`,
            ),
        );

        return Prisma.sql`
            INSERT INTO public.active_user_inbounds (user_uuid, inbound_uuid)
            VALUES ${Prisma.join(values)}
            ON CONFLICT (user_uuid, inbound_uuid) DO NOTHING;
        `;
    }
}
