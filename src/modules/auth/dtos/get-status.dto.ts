import { createZodDto } from 'nestjs-zod';

import { GetStatusCommand } from '@localzet/aura-backend-contract/commands';

export class GetStatusResponseDto extends createZodDto(GetStatusCommand.ResponseSchema) {
}
