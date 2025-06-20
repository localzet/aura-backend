import { createZodDto } from 'nestjs-zod';

import { GetStatusCommand } from '@localzet/aura-contract';

export class GetStatusResponseDto extends createZodDto(GetStatusCommand.ResponseSchema) {
}
