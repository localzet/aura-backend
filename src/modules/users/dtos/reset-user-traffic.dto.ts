import { createZodDto } from 'nestjs-zod';

import { ResetUserTrafficCommand } from '@localzet/aura-contract';

export class ResetUserTrafficRequestDto extends createZodDto(
    ResetUserTrafficCommand.RequestSchema,
) {
}

export class ResetUserTrafficResponseDto extends createZodDto(
    ResetUserTrafficCommand.ResponseSchema,
) {
}
