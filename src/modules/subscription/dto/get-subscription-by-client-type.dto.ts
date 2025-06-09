import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByShortUuidByClientTypeCommand } from '@libs/contracts/commands/subscription';

export class GetSubscriptionByShortUuidByClientTypeRequestDto extends createZodDto(
    GetSubscriptionByShortUuidByClientTypeCommand.RequestSchema,
) {
}
