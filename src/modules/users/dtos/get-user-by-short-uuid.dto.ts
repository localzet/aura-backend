import { createZodDto } from 'nestjs-zod';

import { GetUserByShortUuidCommand } from '@localzet/aura-backend-contract/commands';

export class GetUserByShortUuidRequestDto extends createZodDto(
    GetUserByShortUuidCommand.RequestSchema,
) {
}

export class GetUserByShortUuidResponseDto extends createZodDto(
    GetUserByShortUuidCommand.ResponseSchema,
) {
}
