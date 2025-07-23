/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
    All,
    applyDecorators,
    Delete,
    Get,
    HttpCode,
    Patch,
    Post,
    Put,
    Type,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { EndpointDetails } from '@localzet/aura-contract';

interface ApiEndpointOptions {
    command: { endpointDetails: EndpointDetails };
    httpCode: number;
    apiBody?: string | Function | Type<unknown> | [Function];
}

export function Endpoint(options: ApiEndpointOptions) {
    const method = options.command.endpointDetails.REQUEST_METHOD.toLowerCase();

    const apiBody = options.apiBody ? ApiBody({ type: options.apiBody }) : undefined;

    return applyDecorators(
        resolveRequestMethod(method)(options.command.endpointDetails.CONTROLLER_URL),
        HttpCode(options.httpCode),
        ApiOperation({
            summary: options.command.endpointDetails.METHOD_DESCRIPTION,
            description: options.command.endpointDetails.METHOD_LONG_DESCRIPTION,
        }),
        ...(apiBody ? [apiBody] : []),
    );
}

function resolveRequestMethod(method: string) {
    switch (method) {
        case 'get':
            return Get;
        case 'post':
            return Post;
        case 'put':
            return Put;
        case 'delete':
            return Delete;
        case 'patch':
            return Patch;
        default:
            return All;
    }
}
