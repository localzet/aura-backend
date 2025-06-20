import { createZodDto } from 'nestjs-zod';

import { GetInboundsCommand } from '@localzet/aura-contract/commands';

export class GetInboundsResponseDto extends createZodDto(GetInboundsCommand.ResponseSchema) {
}
