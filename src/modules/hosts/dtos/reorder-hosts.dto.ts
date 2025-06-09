import { createZodDto } from 'nestjs-zod';

import { ReorderHostCommand } from '@libs/contracts/commands';

export class ReorderHostRequestDto extends createZodDto(ReorderHostCommand.RequestSchema) {
}

export class ReorderHostResponseDto extends createZodDto(ReorderHostCommand.ResponseSchema) {
}
