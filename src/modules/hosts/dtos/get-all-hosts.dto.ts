import { createZodDto } from 'nestjs-zod';

import { GetAllHostsCommand } from '@localzet/aura-backend-contract/commands';

export class GetAllHostsResponseDto extends createZodDto(GetAllHostsCommand.ResponseSchema) {
}
