import { createZodDto } from 'nestjs-zod';

import { EnableUserCommand } from '@libs/contracts/commands';

export class EnableUserRequestDto extends createZodDto(EnableUserCommand.RequestSchema) {
}

export class EnableUserResponseDto extends createZodDto(EnableUserCommand.ResponseSchema) {
}
