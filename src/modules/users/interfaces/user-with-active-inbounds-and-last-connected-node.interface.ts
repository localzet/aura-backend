import { Prisma } from '@prisma/client';

export type IUserWithActiveInboundsAndLastConnectedNode = Prisma.UsersGetPayload<{
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
        nodesUserUsageHistory: {
            orderBy: {
                updatedAt: 'desc';
            };
            select: {
                node: {
                    select: {
                        name: true;
                    };
                };
                updatedAt: true;
            };
            take: 1;
        };
    };
}>;

export const USER_INCLUDE_INBOUNDS_AND_LAST_CONNECTED_NODE = {
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
    nodesUserUsageHistory: {
        orderBy: {
            updatedAt: 'desc',
        },
        select: {
            node: {
                select: {
                    name: true,
                },
            },
            updatedAt: true,
        },
        take: 1,
    },
} as const;
