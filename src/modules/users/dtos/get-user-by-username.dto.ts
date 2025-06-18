import { createZodDto } from 'nestjs-zod';

import { GetUserByUsernameCommand } from '@localzet/aura-backend-contract/commands';

export class GetUserByUsernameRequestDto extends createZodDto(
    GetUserByUsernameCommand.RequestSchema,
) {
}

export class GetUserByUsernameResponseDto extends createZodDto(
    GetUserByUsernameCommand.ResponseSchema,
) {
}
