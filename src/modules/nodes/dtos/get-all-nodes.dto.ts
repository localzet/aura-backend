import { createZodDto } from 'nestjs-zod';

import { GetAllNodesCommand } from '@localzet/aura-contract/commands';

export class GetAllNodesResponseDto extends createZodDto(GetAllNodesCommand.ResponseSchema) {
}
