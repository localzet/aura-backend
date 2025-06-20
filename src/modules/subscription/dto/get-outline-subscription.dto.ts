import { createZodDto } from 'nestjs-zod';

import { GetOutlineSubscriptionByShortUuidCommand } from '@localzet/aura-contract';

export class GetOutlineSubscriptionRequestDto extends createZodDto(
    GetOutlineSubscriptionByShortUuidCommand.RequestSchema,
) {
}
