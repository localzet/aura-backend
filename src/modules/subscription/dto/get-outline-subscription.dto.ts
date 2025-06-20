import { createZodDto } from 'nestjs-zod';

import { GetOutlineSubscriptionByShortUuidCommand } from '@localzet/aura-contract/commands/subscription';

export class GetOutlineSubscriptionRequestDto extends createZodDto(
    GetOutlineSubscriptionByShortUuidCommand.RequestSchema,
) {
}
