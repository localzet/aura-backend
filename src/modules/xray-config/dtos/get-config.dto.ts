import { createZodDto } from 'nestjs-zod';

import { GetXrayConfigCommand } from '@libs/contracts/commands';

export class GetConfigResponseDto extends createZodDto(GetXrayConfigCommand.ResponseSchema) {
}
