import { createZodDto } from 'nestjs-zod';

import { DisableNodeCommand } from '@localzet/aura-contract';

export class DisableNodeRequestParamDto extends createZodDto(DisableNodeCommand.RequestSchema) {
}

export class DisableNodeResponseDto extends createZodDto(DisableNodeCommand.ResponseSchema) {
}
