import { createZodDto } from 'nestjs-zod';

import { RestartAllNodesCommand } from '@localzet/aura-contract';

export class RestartAllNodesResponseDto extends createZodDto(
    RestartAllNodesCommand.ResponseSchema,
) {
}
