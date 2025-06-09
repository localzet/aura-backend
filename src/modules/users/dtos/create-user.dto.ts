import { createZodDto } from 'nestjs-zod';

import { CreateUserCommand } from '@libs/contracts/commands/users/create-user.command';

export class CreateUserRequestDto extends createZodDto(CreateUserCommand.RequestSchema) {
}

export class CreateUserResponseDto extends createZodDto(CreateUserCommand.ResponseSchema) {
}
