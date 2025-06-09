import { createZodDto } from 'nestjs-zod';

import { RegisterCommand } from '@libs/contracts/commands';

export class RegisterRequestDto extends createZodDto(RegisterCommand.RequestSchema) {
}

export class RegisterResponseDto extends createZodDto(RegisterCommand.ResponseSchema) {
}
