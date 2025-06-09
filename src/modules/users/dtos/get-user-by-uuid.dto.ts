import { createZodDto } from 'nestjs-zod';

import { GetUserByUuidCommand } from '@libs/contracts/commands';

export class GetUserByUuidRequestDto extends createZodDto(GetUserByUuidCommand.RequestSchema) {
}

export class GetUserByUuidResponseDto extends createZodDto(GetUserByUuidCommand.ResponseSchema) {
}
