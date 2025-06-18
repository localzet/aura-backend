import { createZodDto } from 'nestjs-zod';

import { EnableUserCommand } from '@localzet/aura-backend-contract/commands';

export class EnableUserRequestDto extends createZodDto(EnableUserCommand.RequestSchema) {
}

export class EnableUserResponseDto extends createZodDto(EnableUserCommand.ResponseSchema) {
}
