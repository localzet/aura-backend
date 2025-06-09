import { createZodDto } from 'nestjs-zod';

import { DisableNodeCommand } from '@contract/commands';

export class DisableNodeRequestParamDto extends createZodDto(DisableNodeCommand.RequestSchema) {
}

export class DisableNodeResponseDto extends createZodDto(DisableNodeCommand.ResponseSchema) {
}
