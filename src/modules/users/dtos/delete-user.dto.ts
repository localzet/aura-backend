import { createZodDto } from 'nestjs-zod';

import { DeleteUserCommand } from '@libs/contracts/commands';

export class DeleteUserRequestDto extends createZodDto(DeleteUserCommand.RequestSchema) {
}

export class DeleteUserResponseDto extends createZodDto(DeleteUserCommand.ResponseSchema) {
}
