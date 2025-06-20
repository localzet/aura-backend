import { createZodDto } from 'nestjs-zod';

import { GetUserUsageByRangeCommand } from '@localzet/aura-contract';

export class GetUserUsageByRangeRequestQueryDto extends createZodDto(
    GetUserUsageByRangeCommand.RequestQuerySchema,
) {
}

export class GetUserUsageByRangeRequestDto extends createZodDto(
    GetUserUsageByRangeCommand.RequestSchema,
) {
}

export class GetUserUsageByRangeResponseDto extends createZodDto(
    GetUserUsageByRangeCommand.ResponseSchema,
) {
}
