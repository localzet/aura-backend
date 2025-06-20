import { createZodDto } from 'nestjs-zod';

import { LoginCommand } from '@localzet/aura-contract';

export class LoginRequestDto extends createZodDto(LoginCommand.RequestSchema) {
}

export class LoginResponseDto extends createZodDto(LoginCommand.ResponseSchema) {
}
