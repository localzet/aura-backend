import { createZodDto } from 'nestjs-zod';

import { ReorderNodeCommand } from '@localzet/aura-contract';

export class ReorderNodeRequestDto extends createZodDto(ReorderNodeCommand.RequestSchema) {
}

export class ReorderNodeResponseDto extends createZodDto(ReorderNodeCommand.ResponseSchema) {
}
