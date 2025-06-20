import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByShortUuidByClientTypeCommand } from '@localzet/aura-contract';

export class GetSubscriptionByShortUuidByClientTypeRequestDto extends createZodDto(
    GetSubscriptionByShortUuidByClientTypeCommand.RequestSchema,
) {
}
