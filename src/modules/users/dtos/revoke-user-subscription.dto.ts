import { createZodDto } from 'nestjs-zod';

import { RevokeUserSubscriptionCommand } from '@localzet/aura-backend-contract/commands';

export class RevokeUserSubscriptionRequestDto extends createZodDto(
    RevokeUserSubscriptionCommand.RequestSchema,
) {
}

export class RevokeUserSubscriptionResponseDto extends createZodDto(
    RevokeUserSubscriptionCommand.ResponseSchema,
) {
}

export class RevokeUserSubscriptionBodyDto extends createZodDto(
    RevokeUserSubscriptionCommand.RequestBodySchema,
) {
}
