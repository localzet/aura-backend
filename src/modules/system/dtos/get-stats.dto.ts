import { createZodDto } from 'nestjs-zod';

import { GetStatsCommand } from '@localzet/aura-backend-contract/commands';

export class GetStatsRequestQueryDto extends createZodDto(GetStatsCommand.RequestQuerySchema) {
}

export class GetStatsResponseDto extends createZodDto(GetStatsCommand.ResponseSchema) {
}
