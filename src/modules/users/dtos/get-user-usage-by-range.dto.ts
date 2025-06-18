import { createZodDto } from 'nestjs-zod';

import { GetUserUsageByRangeCommand } from '@localzet/aura-backend-contract/commands';

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
