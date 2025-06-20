import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionSettingsCommand } from '@localzet/aura-contract';

export class GetSubscriptionSettingsResponseDto extends createZodDto(
    GetSubscriptionSettingsCommand.ResponseSchema,
) {
}
