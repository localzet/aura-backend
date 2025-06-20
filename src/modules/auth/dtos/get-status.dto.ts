import { createZodDto } from 'nestjs-zod';

import { GetStatusCommand } from '@localzet/aura-contract/commands';

export class GetStatusResponseDto extends createZodDto(GetStatusCommand.ResponseSchema) {
}
