import { createZodDto } from 'nestjs-zod';

import { GetBandwidthStatsCommand } from '@contract/commands';

export class GetBandwidthStatsRequestQueryDto extends createZodDto(
    GetBandwidthStatsCommand.RequestQuerySchema,
) {
}

export class GetBandwidthStatsResponseDto extends createZodDto(
    GetBandwidthStatsCommand.ResponseSchema,
) {
}
