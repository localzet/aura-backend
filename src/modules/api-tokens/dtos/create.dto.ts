import { createZodDto } from 'nestjs-zod';

import { CreateApiTokenCommand } from '@localzet/aura-contract';

export class CreateApiTokenRequestDto extends createZodDto(CreateApiTokenCommand.RequestSchema) {
}

export class CreateApiTokenResponseDto extends createZodDto(CreateApiTokenCommand.ResponseSchema) {
}
