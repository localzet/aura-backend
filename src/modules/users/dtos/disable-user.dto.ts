import { createZodDto } from 'nestjs-zod';

import { DisableUserCommand } from '@localzet/aura-contract';

export class DisableUserRequestDto extends createZodDto(DisableUserCommand.RequestSchema) {
}

export class DisableUserResponseDto extends createZodDto(DisableUserCommand.ResponseSchema) {
}
