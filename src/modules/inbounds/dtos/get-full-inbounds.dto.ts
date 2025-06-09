import { createZodDto } from 'nestjs-zod';

import { GetFullInboundsCommand } from '@libs/contracts/commands';

export class GetFullInboundsResponseDto extends createZodDto(
    GetFullInboundsCommand.ResponseSchema,
) {
}
