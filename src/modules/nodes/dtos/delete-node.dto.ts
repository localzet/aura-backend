import { createZodDto } from 'nestjs-zod';

import { DeleteNodeCommand } from '@contract/commands';

export class DeleteNodeRequestParamDto extends createZodDto(DeleteNodeCommand.RequestSchema) {
}

export class DeleteNodeResponseDto extends createZodDto(DeleteNodeCommand.ResponseSchema) {
}
