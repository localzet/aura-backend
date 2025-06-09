import { createZodDto } from 'nestjs-zod';

import { GetNodesRealtimeUsageCommand } from '@contract/commands';

export class GetNodesRealtimeUsageResponseDto extends createZodDto(
    GetNodesRealtimeUsageCommand.ResponseSchema,
) {
}
