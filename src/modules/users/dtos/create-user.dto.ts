import { createZodDto } from 'nestjs-zod';

import { CreateUserCommand } from '@localzet/aura-contract';

export class CreateUserRequestDto extends createZodDto(CreateUserCommand.RequestSchema) {
}

export class CreateUserResponseDto extends createZodDto(CreateUserCommand.ResponseSchema) {
}
