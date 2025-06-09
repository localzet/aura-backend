import { createZodDto } from 'nestjs-zod';

import { UpdateUserCommand } from '@libs/contracts/commands';

export class UpdateUserRequestDto extends createZodDto(UpdateUserCommand.RequestSchema) {
}

export class UpdateUserResponseDto extends createZodDto(UpdateUserCommand.ResponseSchema) {
}
