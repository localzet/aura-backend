import { createZodDto } from 'nestjs-zod';

import { UpdateUserCommand } from '@localzet/aura-contract';

export class UpdateUserRequestDto extends createZodDto(UpdateUserCommand.RequestSchema) {
}

export class UpdateUserResponseDto extends createZodDto(UpdateUserCommand.ResponseSchema) {
}
