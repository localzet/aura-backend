process.env.DATABASE_URL = 'postgresql://postgres:postgres@aura-db:5432/postgres';
process.env.SUPERADMIN_USERNAME = 'mock';
process.env.SUPERADMIN_PASSWORD = 'mock';
process.env.JWT_AUTH_SECRET = 'mock';
process.env.JWT_API_TOKENS_SECRET = 'mock';
process.env.FRONT_END_DOMAIN = 'mock';
process.env.EXPIRED_USER_REMARKS = '["123"]';
process.env.DISABLED_USER_REMARKS = '["123"]';
process.env.LIMITED_USER_REMARKS = '["123"]';
process.env.METRICS_USER = 'mock';
process.env.METRICS_PASS = 'mock';
process.env.SUB_PUBLIC_DOMAIN = 'mock';
process.env.IS_DOCS_ENABLED = 'true';
process.env.NODE_ENV = 'development';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.INSTANCE_TYPE = 'api';

import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import * as winston from 'winston';
import { createLogger } from 'winston';

import { API_ROOT } from '@localzet/aura-contract';

import { NestFactory } from '@nestjs/core';

import { ghActionsDocs } from '@common/utils/startup-app/gh-actions-docs';
import { isDevelopment } from '@common/utils/startup-app';

import { AppModule } from '../../app.module';

patchNestJsSwagger();

// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6,
// };

const logger = createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: false,
        }),
    ),
    level: isDevelopment() ? 'debug' : 'http',
});

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    });

    ghActionsDocs(app);

    app.setGlobalPrefix(API_ROOT);

    app.useGlobalPipes(new ZodValidationPipe());

    app.enableShutdownHooks();

    await app.init();
}

bootstrap().catch(() => {
    process.exit(0);
});
