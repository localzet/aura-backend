import { createZodDto } from 'nestjs-zod';

import { GetBandwidthStatsCommand } from '@localzet/aura-contract';

export class GetBandwidthStatsRequestQueryDto extends createZodDto(
    GetBandwidthStatsCommand.RequestQuerySchema,
) {
}

export class GetBandwidthStatsResponseDto extends createZodDto(
    GetBandwidthStatsCommand.ResponseSchema,
) {
}
