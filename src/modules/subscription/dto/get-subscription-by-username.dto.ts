import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionByUsernameCommand } from '@localzet/aura-contract/commands/subscriptions';

export class GetSubscriptionByUsernameRequestDto extends createZodDto(
    GetSubscriptionByUsernameCommand.RequestSchema,
) {
}

export class GetSubscriptionByUsernameResponseDto extends createZodDto(
    GetSubscriptionByUsernameCommand.ResponseSchema,
) {
}
