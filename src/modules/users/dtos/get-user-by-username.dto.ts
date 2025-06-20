import { createZodDto } from 'nestjs-zod';

import { GetUserByUsernameCommand } from '@localzet/aura-contract';

export class GetUserByUsernameRequestDto extends createZodDto(
    GetUserByUsernameCommand.RequestSchema,
) {
}

export class GetUserByUsernameResponseDto extends createZodDto(
    GetUserByUsernameCommand.ResponseSchema,
) {
}
