import { createZodDto } from 'nestjs-zod';

import { EnableNodeCommand } from '@localzet/aura-backend-contract/commands';

export class EnableNodeRequestParamDto extends createZodDto(EnableNodeCommand.RequestSchema) {
}

export class EnableNodeResponseDto extends createZodDto(EnableNodeCommand.ResponseSchema) {
}
