import { createZodDto } from 'nestjs-zod';

import { UpdateNodeCommand } from '@localzet/aura-contract';

export class UpdateNodeRequestDto extends createZodDto(UpdateNodeCommand.RequestSchema) {
}

export class UpdateNodeResponseDto extends createZodDto(UpdateNodeCommand.ResponseSchema) {
}
