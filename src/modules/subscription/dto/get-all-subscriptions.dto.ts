import { createZodDto } from 'nestjs-zod';

import { GetAllSubscriptionsCommand } from '@localzet/aura-contract/commands/subscriptions';

export class GetAllSubscriptionsQueryDto extends createZodDto(
    GetAllSubscriptionsCommand.RequestQuerySchema,
) {
}

export class GetAllSubscriptionsResponseDto extends createZodDto(
    GetAllSubscriptionsCommand.ResponseSchema,
) {
}
