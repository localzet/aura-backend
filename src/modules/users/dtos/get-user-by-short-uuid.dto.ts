import { createZodDto } from 'nestjs-zod';

import { GetUserByShortUuidCommand } from '@localzet/aura-contract';

export class GetUserByShortUuidRequestDto extends createZodDto(
    GetUserByShortUuidCommand.RequestSchema,
) {
}

export class GetUserByShortUuidResponseDto extends createZodDto(
    GetUserByShortUuidCommand.ResponseSchema,
) {
}
