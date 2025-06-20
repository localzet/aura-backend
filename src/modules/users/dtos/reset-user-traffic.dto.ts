import { createZodDto } from 'nestjs-zod';

import { ResetUserTrafficCommand } from '@localzet/aura-contract/commands';

export class ResetUserTrafficRequestDto extends createZodDto(
    ResetUserTrafficCommand.RequestSchema,
) {
}

export class ResetUserTrafficResponseDto extends createZodDto(
    ResetUserTrafficCommand.ResponseSchema,
) {
}
