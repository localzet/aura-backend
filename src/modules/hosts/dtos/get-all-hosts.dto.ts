import { createZodDto } from 'nestjs-zod';

import { GetAllHostsCommand } from '@localzet/aura-contract/commands';

export class GetAllHostsResponseDto extends createZodDto(GetAllHostsCommand.ResponseSchema) {
}
