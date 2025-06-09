import { apiReference } from '@scalar/nestjs-api-reference';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { readPackageJSON } from 'pkg-types';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const description = `
Aura is a powerful proxy management tool, built on top of Xray-core, with a focus on simplicity and ease of use.
`;

export async function getDocs(app: INestApplication<unknown>, config: ConfigService) {
    const isSwaggerEnabled = config.getOrThrow<string>('IS_DOCS_ENABLED');

    if (isSwaggerEnabled === 'true') {
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

        const theme = new SwaggerTheme();
        const options = {
            explorer: false,
            customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
            customSiteTitle: 'Aura API Schema',
            swaggerOptions: {
                persistAuthorization: true,
            },
        };

        SwaggerModule.setup(
            config.getOrThrow<string>('SWAGGER_PATH'),
            app,
            documentFactory,
            options,
        );

        app.use(
            config.getOrThrow<string>('SCALAR_PATH'),

            apiReference({
                showSidebar: true,
                layout: 'modern',
                hideModels: false,
                hideDownloadButton: false,
                hideTestRequestButton: false,
                isEditable: false,
                isLoading: false,
                hideDarkModeToggle: false,
                withDefaultFonts: true,
                hideSearch: false,
                theme: 'purple',
                hideClientButton: false,
                darkMode: true,
                hiddenClients: [
                    'asynchttp',
                    'nethttp',
                    'okhttp',
                    'unirest',
                    'nsurlsession',
                    'httr',
                    'native',
                    'libcurl',
                    'httpclient',
                    'restsharp',
                    'clj_http',
                    'webrequest',
                    'restmethod',
                    'cohttp',
                ],
                defaultHttpClient: {
                    targetKey: 'js',
                    clientKey: 'axios',
                },

                content: documentFactory,
            }),
        );
    }
}
