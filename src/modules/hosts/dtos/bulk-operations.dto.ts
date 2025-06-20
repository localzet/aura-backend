import { createZodDto } from 'nestjs-zod';

import {
    BulkDeleteHostsCommand,
    BulkDisableHostsCommand,
    BulkEnableHostsCommand,
    SetInboundToManyHostsCommand,
    SetPortToManyHostsCommand,
} from '@localzet/aura-contract';

export class BulkDeleteHostsRequestDto extends createZodDto(BulkDeleteHostsCommand.RequestSchema) {
}

export class BulkDeleteHostsResponseDto extends createZodDto(
    BulkDeleteHostsCommand.ResponseSchema,
) {
}

export class BulkDisableHostsRequestDto extends createZodDto(
    BulkDisableHostsCommand.RequestSchema,
) {
}

export class BulkDisableHostsResponseDto extends createZodDto(
    BulkDisableHostsCommand.ResponseSchema,
) {
}

export class BulkEnableHostsRequestDto extends createZodDto(BulkEnableHostsCommand.RequestSchema) {
}

export class BulkEnableHostsResponseDto extends createZodDto(
    BulkEnableHostsCommand.ResponseSchema,
) {
}

export class SetInboundToManyHostsRequestDto extends createZodDto(
    SetInboundToManyHostsCommand.RequestSchema,
) {
}

export class SetInboundToManyHostsResponseDto extends createZodDto(
    SetInboundToManyHostsCommand.ResponseSchema,
) {
}

export class SetPortToManyHostsRequestDto extends createZodDto(
    SetPortToManyHostsCommand.RequestSchema,
) {
}

export class SetPortToManyHostsResponseDto extends createZodDto(
    SetPortToManyHostsCommand.ResponseSchema,
) {
}
