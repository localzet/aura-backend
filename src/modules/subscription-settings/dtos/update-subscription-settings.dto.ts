import { createZodDto } from 'nestjs-zod';

import { UpdateSubscriptionSettingsCommand } from '@localzet/aura-contract/commands';

export class UpdateSubscriptionSettingsRequestDto extends createZodDto(
    UpdateSubscriptionSettingsCommand.RequestSchema,
) {
}

export class UpdateSubscriptionSettingsResponseDto extends createZodDto(
    UpdateSubscriptionSettingsCommand.ResponseSchema,
) {
}
