import { createZodDto } from 'nestjs-zod';

import { RestartAllNodesCommand } from '@localzet/aura-contract/commands';

export class RestartAllNodesResponseDto extends createZodDto(
    RestartAllNodesCommand.ResponseSchema,
) {
}
