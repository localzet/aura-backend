import { createZodDto } from 'nestjs-zod';

import { UpdateSubscriptionSettingsCommand } from '@localzet/aura-contract';

export class UpdateSubscriptionSettingsRequestDto extends createZodDto(
    UpdateSubscriptionSettingsCommand.RequestSchema,
) {
}

export class UpdateSubscriptionSettingsResponseDto extends createZodDto(
    UpdateSubscriptionSettingsCommand.ResponseSchema,
) {
}
