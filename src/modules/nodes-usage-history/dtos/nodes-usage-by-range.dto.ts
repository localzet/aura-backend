import { createZodDto } from 'nestjs-zod';

import { GetNodesUsageByRangeCommand } from '@contract/commands';

export class GetNodesUsageByRangeRequestQueryDto extends createZodDto(
    GetNodesUsageByRangeCommand.RequestQuerySchema,
) {
}

export class GetNodesUsageByRangeResponseDto extends createZodDto(
    GetNodesUsageByRangeCommand.ResponseSchema,
) {
}
