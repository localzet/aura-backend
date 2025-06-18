import { createZodDto } from 'nestjs-zod';

import { GetNodesStatisticsCommand } from '@localzet/aura-backend-contract/commands';

export class GetNodesStatisticsRequestQueryDto extends createZodDto(
    GetNodesStatisticsCommand.RequestQuerySchema,
) {
}

export class GetNodesStatisticsResponseDto extends createZodDto(
    GetNodesStatisticsCommand.ResponseSchema,
) {
}
