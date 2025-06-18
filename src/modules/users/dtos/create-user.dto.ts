import { createZodDto } from 'nestjs-zod';

import { CreateUserCommand } from '@localzet/aura-backend-contract/commands/users/create-user.command';

export class CreateUserRequestDto extends createZodDto(CreateUserCommand.RequestSchema) {
}

export class CreateUserResponseDto extends createZodDto(CreateUserCommand.ResponseSchema) {
}
