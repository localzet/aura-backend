import { createZodDto } from 'nestjs-zod';

import { GetAllNodesCommand } from '@localzet/aura-contract';

export class GetAllNodesResponseDto extends createZodDto(GetAllNodesCommand.ResponseSchema) {
}
