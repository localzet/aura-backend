import { createZodDto } from 'nestjs-zod';

import { GetAllNodesCommand } from '@localzet/aura-backend-contract/commands';

export class GetAllNodesResponseDto extends createZodDto(GetAllNodesCommand.ResponseSchema) {
}
