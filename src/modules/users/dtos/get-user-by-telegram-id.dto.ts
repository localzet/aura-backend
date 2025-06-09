import { createZodDto } from 'nestjs-zod';

import { GetUserByTelegramIdCommand } from '@libs/contracts/commands';

export class GetUserByTelegramIdRequestDto extends createZodDto(
    GetUserByTelegramIdCommand.RequestSchema,
) {
}

export class GetUserByTelegramIdResponseDto extends createZodDto(
    GetUserByTelegramIdCommand.ResponseSchema,
) {
}
