import { createZodDto } from 'nestjs-zod';

import { GetAllNodesCommand } from '@contract/commands';

export class GetAllNodesResponseDto extends createZodDto(GetAllNodesCommand.ResponseSchema) {
}
