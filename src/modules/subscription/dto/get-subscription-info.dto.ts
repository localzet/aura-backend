import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionInfoByShortUuidCommand } from '@localzet/aura-contract';

export class GetSubscriptionInfoRequestDto extends createZodDto(
    GetSubscriptionInfoByShortUuidCommand.RequestSchema,
) {
}

export class GetSubscriptionInfoResponseDto extends createZodDto(
    GetSubscriptionInfoByShortUuidCommand.ResponseSchema,
) {
}
