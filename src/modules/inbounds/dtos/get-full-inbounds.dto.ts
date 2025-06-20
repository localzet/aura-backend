import { createZodDto } from 'nestjs-zod';

import { GetFullInboundsCommand } from '@localzet/aura-contract/commands';

export class GetFullInboundsResponseDto extends createZodDto(
    GetFullInboundsCommand.ResponseSchema,
) {
}
