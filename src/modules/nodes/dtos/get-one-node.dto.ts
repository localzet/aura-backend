import { createZodDto } from 'nestjs-zod';

import { GetOneNodeCommand } from '@localzet/aura-backend-contract/commands';

export class GetOneNodeRequestParamDto extends createZodDto(GetOneNodeCommand.RequestSchema) {
}

export class GetOneNodeResponseDto extends createZodDto(GetOneNodeCommand.ResponseSchema) {
}
