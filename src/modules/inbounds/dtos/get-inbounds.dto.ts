import { createZodDto } from 'nestjs-zod';

import { GetInboundsCommand } from '@localzet/aura-contract';

export class GetInboundsResponseDto extends createZodDto(GetInboundsCommand.ResponseSchema) {
}
