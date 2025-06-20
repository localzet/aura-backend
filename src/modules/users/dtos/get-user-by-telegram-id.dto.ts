import { createZodDto } from 'nestjs-zod';

import { GetUserByTelegramIdCommand } from '@localzet/aura-contract/commands';

export class GetUserByTelegramIdRequestDto extends createZodDto(
    GetUserByTelegramIdCommand.RequestSchema,
) {
}

export class GetUserByTelegramIdResponseDto extends createZodDto(
    GetUserByTelegramIdCommand.ResponseSchema,
) {
}
