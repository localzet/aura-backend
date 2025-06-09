import { createZodDto } from 'nestjs-zod';

import { GetInboundsCommand } from '@libs/contracts/commands';

export class GetInboundsResponseDto extends createZodDto(GetInboundsCommand.ResponseSchema) {
}
