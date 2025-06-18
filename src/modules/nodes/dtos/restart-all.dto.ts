import { createZodDto } from 'nestjs-zod';

import { RestartAllNodesCommand } from '@localzet/aura-backend-contract/commands';

export class RestartAllNodesResponseDto extends createZodDto(
    RestartAllNodesCommand.ResponseSchema,
) {
}
