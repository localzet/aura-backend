import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionSettingsCommand } from '@libs/contracts/commands';

export class GetSubscriptionSettingsResponseDto extends createZodDto(
    GetSubscriptionSettingsCommand.ResponseSchema,
) {
}
