import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionInfoByShortUuidCommand } from '@libs/contracts/commands/subscription';

export class GetSubscriptionInfoRequestDto extends createZodDto(
    GetSubscriptionInfoByShortUuidCommand.RequestSchema,
) {
}

export class GetSubscriptionInfoResponseDto extends createZodDto(
    GetSubscriptionInfoByShortUuidCommand.ResponseSchema,
) {
}
