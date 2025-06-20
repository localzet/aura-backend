import { createZodDto } from 'nestjs-zod';

import {
    AddInboundToNodesCommand,
    AddInboundToUsersCommand,
    RemoveInboundFromNodesCommand,
    RemoveInboundFromUsersCommand,
} from '@localzet/aura-contract';

export class AddInboundToUsersRequestDto extends createZodDto(
    AddInboundToUsersCommand.RequestSchema,
) {
}

export class AddInboundToUsersResponseDto extends createZodDto(
    AddInboundToUsersCommand.ResponseSchema,
) {
}

export class RemoveInboundFromUsersRequestDto extends createZodDto(
    RemoveInboundFromUsersCommand.RequestSchema,
) {
}

export class RemoveInboundFromUsersResponseDto extends createZodDto(
    RemoveInboundFromUsersCommand.ResponseSchema,
) {
}

export class AddInboundToNodesRequestDto extends createZodDto(
    AddInboundToNodesCommand.RequestSchema,
) {
}

export class AddInboundToNodesResponseDto extends createZodDto(
    AddInboundToNodesCommand.ResponseSchema,
) {
}

export class RemoveInboundFromNodesRequestDto extends createZodDto(
    RemoveInboundFromNodesCommand.RequestSchema,
) {
}

export class RemoveInboundFromNodesResponseDto extends createZodDto(
    RemoveInboundFromNodesCommand.ResponseSchema,
) {
}
