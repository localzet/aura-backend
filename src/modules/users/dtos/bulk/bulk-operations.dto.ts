import { createZodDto } from 'nestjs-zod';

import {
    BulkAllResetTrafficUsersCommand,
    BulkAllUpdateUsersCommand,
    BulkDeleteUsersCommand,
    BulkResetTrafficUsersCommand,
    BulkRevokeUsersSubscriptionCommand,
    BulkUpdateUsersCommand,
    BulkUpdateUsersInboundsCommand,
} from '@localzet/aura-backend-contract/commands';

export class BulkResetTrafficUsersRequestDto extends createZodDto(
    BulkResetTrafficUsersCommand.RequestSchema,
) {
}

export class BulkResetTrafficUsersResponseDto extends createZodDto(
    BulkResetTrafficUsersCommand.ResponseSchema,
) {
}

export class BulkRevokeUsersSubscriptionRequestDto extends createZodDto(
    BulkRevokeUsersSubscriptionCommand.RequestSchema,
) {
}

export class BulkRevokeUsersSubscriptionResponseDto extends createZodDto(
    BulkRevokeUsersSubscriptionCommand.ResponseSchema,
) {
}

export class BulkDeleteUsersRequestDto extends createZodDto(BulkDeleteUsersCommand.RequestSchema) {
}

export class BulkDeleteUsersResponseDto extends createZodDto(
    BulkDeleteUsersCommand.ResponseSchema,
) {
}

export class BulkUpdateUsersRequestDto extends createZodDto(BulkUpdateUsersCommand.RequestSchema) {
}

export class BulkUpdateUsersResponseDto extends createZodDto(
    BulkUpdateUsersCommand.ResponseSchema,
) {
}

export class BulkUpdateUsersInboundsRequestDto extends createZodDto(
    BulkUpdateUsersInboundsCommand.RequestSchema,
) {
}

export class BulkUpdateUsersInboundsResponseDto extends createZodDto(
    BulkUpdateUsersInboundsCommand.ResponseSchema,
) {
}

export class BulkAllUpdateUsersRequestDto extends createZodDto(
    BulkAllUpdateUsersCommand.RequestSchema,
) {
}

export class BulkAllUpdateUsersResponseDto extends createZodDto(
    BulkAllUpdateUsersCommand.ResponseSchema,
) {
}

export class BulkAllResetTrafficUsersResponseDto extends createZodDto(
    BulkAllResetTrafficUsersCommand.ResponseSchema,
) {
}
