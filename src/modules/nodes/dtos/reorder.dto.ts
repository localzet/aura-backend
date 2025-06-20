import { createZodDto } from 'nestjs-zod';

import { ReorderNodeCommand } from '@localzet/aura-contract/commands';

export class ReorderNodeRequestDto extends createZodDto(ReorderNodeCommand.RequestSchema) {
}

export class ReorderNodeResponseDto extends createZodDto(ReorderNodeCommand.ResponseSchema) {
}
