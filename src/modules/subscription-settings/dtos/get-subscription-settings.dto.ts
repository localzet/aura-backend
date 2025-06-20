import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionSettingsCommand } from '@localzet/aura-contract/commands';

export class GetSubscriptionSettingsResponseDto extends createZodDto(
    GetSubscriptionSettingsCommand.ResponseSchema,
) {
}
