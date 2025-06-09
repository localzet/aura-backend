import { createZodDto } from 'nestjs-zod';

import { UpdateSubscriptionSettingsCommand } from '@libs/contracts/commands';

export class UpdateSubscriptionSettingsRequestDto extends createZodDto(
    UpdateSubscriptionSettingsCommand.RequestSchema,
) {
}

export class UpdateSubscriptionSettingsResponseDto extends createZodDto(
    UpdateSubscriptionSettingsCommand.ResponseSchema,
) {
}
