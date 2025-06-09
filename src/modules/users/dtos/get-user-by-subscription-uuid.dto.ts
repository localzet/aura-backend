import { createZodDto } from 'nestjs-zod';

import { GetUserBySubscriptionUuidCommand } from '@libs/contracts/commands';

export class GetUserBySubscriptionUuidRequestDto extends createZodDto(
    GetUserBySubscriptionUuidCommand.RequestSchema,
) {
}

export class GetUserBySubscriptionUuidResponseDto extends createZodDto(
    GetUserBySubscriptionUuidCommand.ResponseSchema,
) {
}
