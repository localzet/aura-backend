import { createZodDto } from 'nestjs-zod';

import { DeleteApiTokenCommand } from '@localzet/aura-contract/commands';

export class DeleteApiTokenRequestDto extends createZodDto(DeleteApiTokenCommand.RequestSchema) {
}

export class DeleteApiTokenResponseDto extends createZodDto(DeleteApiTokenCommand.ResponseSchema) {
}
