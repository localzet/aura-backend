import { createZodDto } from 'nestjs-zod';

import { GetOutlineSubscriptionByShortUuidCommand } from '@libs/contracts/commands/subscription';

export class GetOutlineSubscriptionRequestDto extends createZodDto(
    GetOutlineSubscriptionByShortUuidCommand.RequestSchema,
) {
}
