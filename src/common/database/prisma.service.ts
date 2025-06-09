import { PrismaClient } from '@prisma/client';

import { Injectable, OnModuleInit } from '@nestjs/common';

// { log: ['query'] }
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }
}
