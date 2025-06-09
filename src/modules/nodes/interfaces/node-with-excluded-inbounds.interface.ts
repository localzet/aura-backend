import { Prisma } from '@prisma/client';

export type INodeWithExcludedInbounds = Prisma.NodesGetPayload<{
    include: {
        inboundsExclusions: {
            select: {
                inbound: {
                    select: {
                        tag: true;
                        type: true;
                        network: true;
                        security: true;
                        uuid: true;
                    };
                };
            };
        };
    };
}>;
