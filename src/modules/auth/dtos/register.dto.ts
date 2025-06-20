import { createZodDto } from 'nestjs-zod';

import { RegisterCommand } from '@localzet/aura-contract';

export class RegisterRequestDto extends createZodDto(RegisterCommand.RequestSchema) {
}

export class RegisterResponseDto extends createZodDto(RegisterCommand.ResponseSchema) {
}
