import { createZodDto } from 'nestjs-zod';

import { EnableNodeCommand } from '@localzet/aura-contract';

export class EnableNodeRequestParamDto extends createZodDto(EnableNodeCommand.RequestSchema) {
}

export class EnableNodeResponseDto extends createZodDto(EnableNodeCommand.ResponseSchema) {
}
