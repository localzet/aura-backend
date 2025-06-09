import { createZodDto } from 'nestjs-zod';

import { GetStatusCommand } from '@libs/contracts/commands';

export class GetStatusResponseDto extends createZodDto(GetStatusCommand.ResponseSchema) {
}
