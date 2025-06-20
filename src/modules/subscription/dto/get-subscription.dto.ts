import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByShortUuidCommand } from '@localzet/aura-contract/commands/subscription';

export class GetSubscriptionByShortUuidRequestDto extends createZodDto(
    GetSubscriptionByShortUuidCommand.RequestSchema,
) {
}
