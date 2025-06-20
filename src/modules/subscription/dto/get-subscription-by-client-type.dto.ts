import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByShortUuidByClientTypeCommand } from '@localzet/aura-contract/commands/subscription';

export class GetSubscriptionByShortUuidByClientTypeRequestDto extends createZodDto(
    GetSubscriptionByShortUuidByClientTypeCommand.RequestSchema,
) {
}
