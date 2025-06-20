import { createZodDto } from 'nestjs-zod';

import { DeleteUserCommand } from '@localzet/aura-contract';

export class DeleteUserRequestDto extends createZodDto(DeleteUserCommand.RequestSchema) {
}

export class DeleteUserResponseDto extends createZodDto(DeleteUserCommand.ResponseSchema) {
}
