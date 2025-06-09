import { createZodDto } from 'nestjs-zod';

import { ResetUserTrafficCommand } from '@libs/contracts/commands';

export class ResetUserTrafficRequestDto extends createZodDto(
    ResetUserTrafficCommand.RequestSchema,
) {
}

export class ResetUserTrafficResponseDto extends createZodDto(
    ResetUserTrafficCommand.ResponseSchema,
) {
}
