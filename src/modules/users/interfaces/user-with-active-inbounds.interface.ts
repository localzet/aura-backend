import { Prisma } from '@prisma/client';

export type IUserWithActiveInbounds = Prisma.UsersGetPayload<{
    include: {
        activeUserInbounds: {
            select: {
                inbound: {
                    select: {
                        tag: true;
                        type: true;
                        uuid: true;
                        network: true;
                        security: true;
                    };
                };
            };
        };
    };
}>;

export const USER_INCLUDE_INBOUNDS = {
    activeUserInbounds: {
        select: {
            inbound: {
                select: {
                    uuid: true,
                    tag: true,
                    type: true,
                    network: true,
                    security: true,
                },
            },
        },
    },
} as const;
