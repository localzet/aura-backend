import { createZodDto } from 'nestjs-zod';

import { GetAllHostsCommand } from '@localzet/aura-contract';

export class GetAllHostsResponseDto extends createZodDto(GetAllHostsCommand.ResponseSchema) {
}
