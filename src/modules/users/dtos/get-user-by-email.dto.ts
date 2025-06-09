import { createZodDto } from 'nestjs-zod';

import { GetUserByEmailCommand } from '@libs/contracts/commands';

export class GetUserByEmailRequestDto extends createZodDto(GetUserByEmailCommand.RequestSchema) {
}

export class GetUserByEmailResponseDto extends createZodDto(GetUserByEmailCommand.ResponseSchema) {
}
