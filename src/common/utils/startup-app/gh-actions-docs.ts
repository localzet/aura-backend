import { readPackageJSON } from 'pkg-types';
import fs from 'node:fs';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const description = `
Aura is a powerful proxy managment tool, built on top of Xray-core, with a focus on simplicity and ease of use.
`;

export async function ghActionsDocs(app: INestApplication<unknown>) {
    const pkg = await readPackageJSON();

    const configSwagger = new DocumentBuilder()
        .setTitle(`Aura API v${pkg.version}`)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                description: 'JWT obtained login.',
            },
            'Authorization',
        )
        .addBasicAuth(
            {
                type: 'http',
                scheme: 'basic',
                name: 'Prometheus',
                description: 'Prometheus Basic Auth',
            },
            'Prometheus',
        )
        .setDescription(description)
        .setVersion(pkg.version!)
        .setLicense('AGPL-3.0', 'https://github.com/localzet/aura-docs?tab=AGPL-3.0-1-ov-file')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, configSwagger);

    const document = documentFactory();

    fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
}
