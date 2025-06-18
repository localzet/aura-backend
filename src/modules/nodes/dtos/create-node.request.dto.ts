import { createZodDto } from 'nestjs-zod';

import { CreateNodeCommand } from '@localzet/aura-backend-contract/commands';

export class CreateNodeRequestDto extends createZodDto(CreateNodeCommand.RequestSchema) {
}

export class CreateNodeResponseDto extends createZodDto(CreateNodeCommand.ResponseSchema) {
}
