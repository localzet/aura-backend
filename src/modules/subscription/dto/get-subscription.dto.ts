import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByShortUuidCommand } from '@localzet/aura-contract';

export class GetSubscriptionByShortUuidRequestDto extends createZodDto(
    GetSubscriptionByShortUuidCommand.RequestSchema,
) {
}
