import { createZodDto } from 'nestjs-zod';

import { TelegramCallbackCommand } from '@localzet/aura-contract/commands';

export class TelegramCallbackRequestDto extends createZodDto(
    TelegramCallbackCommand.RequestSchema,
) {
}

export class TelegramCallbackResponseDto extends createZodDto(
    TelegramCallbackCommand.ResponseSchema,
) {
}
