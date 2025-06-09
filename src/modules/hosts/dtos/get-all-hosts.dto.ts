import { createZodDto } from 'nestjs-zod';

import { GetAllHostsCommand } from '@libs/contracts/commands';

export class GetAllHostsResponseDto extends createZodDto(GetAllHostsCommand.ResponseSchema) {
}
