import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByShortUuidCommand } from '@libs/contracts/commands/subscription';

export class GetSubscriptionByShortUuidRequestDto extends createZodDto(
    GetSubscriptionByShortUuidCommand.RequestSchema,
) {
}
