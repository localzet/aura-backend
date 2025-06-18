import { createZodDto } from 'nestjs-zod';

import { ActivateAllInboundsCommand } from '@localzet/aura-backend-contract/commands';

export class ActivateAllInboundsRequestDto extends createZodDto(
    ActivateAllInboundsCommand.RequestSchema,
) {
}

export class ActivateAllInboundsResponseDto extends createZodDto(
    ActivateAllInboundsCommand.ResponseSchema,
) {
}
