import { createZodDto } from 'nestjs-zod';

import { GetFullInboundsCommand } from '@localzet/aura-contract';

export class GetFullInboundsResponseDto extends createZodDto(
    GetFullInboundsCommand.ResponseSchema,
) {
}
