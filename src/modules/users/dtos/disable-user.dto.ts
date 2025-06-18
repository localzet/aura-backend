import { createZodDto } from 'nestjs-zod';

import { DisableUserCommand } from '@localzet/aura-backend-contract/commands';

export class DisableUserRequestDto extends createZodDto(DisableUserCommand.RequestSchema) {
}

export class DisableUserResponseDto extends createZodDto(DisableUserCommand.ResponseSchema) {
}
