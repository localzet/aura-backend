import { createZodDto } from 'nestjs-zod';

import { GetNodesRealtimeUsageCommand } from '@localzet/aura-contract';

export class GetNodesRealtimeUsageResponseDto extends createZodDto(
    GetNodesRealtimeUsageCommand.ResponseSchema,
) {
}
