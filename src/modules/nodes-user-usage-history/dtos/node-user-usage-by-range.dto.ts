import { createZodDto } from 'nestjs-zod';

import { GetNodeUserUsageByRangeCommand } from '@contract/commands';

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
