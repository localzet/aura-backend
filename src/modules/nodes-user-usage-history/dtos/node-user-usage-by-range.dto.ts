import { createZodDto } from 'nestjs-zod';

import { GetNodeUserUsageByRangeCommand } from '@localzet/aura-contract';

export class GetNodeUserUsageByRangeRequestQueryDto extends createZodDto(
    GetNodeUserUsageByRangeCommand.RequestQuerySchema,
) {
}

export class GetNodeUserUsageByRangeRequestDto extends createZodDto(
    GetNodeUserUsageByRangeCommand.RequestSchema,
) {
}

export class GetNodeUserUsageByRangeResponseDto extends createZodDto(
    GetNodeUserUsageByRangeCommand.ResponseSchema,
) {
}
