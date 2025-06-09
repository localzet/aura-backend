import { createZodDto } from 'nestjs-zod';

import { CreateNodeCommand } from '@contract/commands';

export class CreateNodeRequestDto extends createZodDto(CreateNodeCommand.RequestSchema) {
}

export class CreateNodeResponseDto extends createZodDto(CreateNodeCommand.ResponseSchema) {
}
