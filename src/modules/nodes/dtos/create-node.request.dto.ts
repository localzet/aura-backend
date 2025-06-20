import { createZodDto } from 'nestjs-zod';

import { CreateNodeCommand } from '@localzet/aura-contract/commands';

export class CreateNodeRequestDto extends createZodDto(CreateNodeCommand.RequestSchema) {
}

export class CreateNodeResponseDto extends createZodDto(CreateNodeCommand.ResponseSchema) {
}
