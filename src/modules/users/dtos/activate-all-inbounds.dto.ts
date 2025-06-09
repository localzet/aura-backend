import { createZodDto } from 'nestjs-zod';

import { ActivateAllInboundsCommand } from '@libs/contracts/commands';

export class ActivateAllInboundsRequestDto extends createZodDto(
    ActivateAllInboundsCommand.RequestSchema,
) {
}

export class ActivateAllInboundsResponseDto extends createZodDto(
    ActivateAllInboundsCommand.ResponseSchema,
) {
}
