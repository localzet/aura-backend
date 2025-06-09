import { createZodDto } from 'nestjs-zod';

import { GetOneNodeCommand } from '@contract/commands';

export class GetOneNodeRequestParamDto extends createZodDto(GetOneNodeCommand.RequestSchema) {
}

export class GetOneNodeResponseDto extends createZodDto(GetOneNodeCommand.ResponseSchema) {
}
