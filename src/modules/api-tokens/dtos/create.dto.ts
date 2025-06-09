import { createZodDto } from 'nestjs-zod';

import { CreateApiTokenCommand } from '@libs/contracts/commands';

export class CreateApiTokenRequestDto extends createZodDto(CreateApiTokenCommand.RequestSchema) {
}

export class CreateApiTokenResponseDto extends createZodDto(CreateApiTokenCommand.ResponseSchema) {
}
