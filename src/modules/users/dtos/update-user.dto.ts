import { createZodDto } from 'nestjs-zod';

import { UpdateUserCommand } from '@localzet/aura-backend-contract/commands';

export class UpdateUserRequestDto extends createZodDto(UpdateUserCommand.RequestSchema) {
}

export class UpdateUserResponseDto extends createZodDto(UpdateUserCommand.ResponseSchema) {
}
