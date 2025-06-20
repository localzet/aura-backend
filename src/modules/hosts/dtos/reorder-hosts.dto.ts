import { createZodDto } from 'nestjs-zod';

import { ReorderHostCommand } from '@localzet/aura-contract/commands';

export class ReorderHostRequestDto extends createZodDto(ReorderHostCommand.RequestSchema) {
}

export class ReorderHostResponseDto extends createZodDto(ReorderHostCommand.ResponseSchema) {
}
