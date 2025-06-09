import { createZodDto } from 'nestjs-zod';

import { CreateHostCommand } from '@libs/contracts/commands';

export class CreateHostRequestDto extends createZodDto(CreateHostCommand.RequestSchema) {
}

export class CreateHostResponseDto extends createZodDto(CreateHostCommand.ResponseSchema) {
}
