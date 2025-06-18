import { createZodDto } from 'nestjs-zod';

import { GetNodesRealtimeUsageCommand } from '@localzet/aura-backend-contract/commands';

export class GetNodesRealtimeUsageResponseDto extends createZodDto(
    GetNodesRealtimeUsageCommand.ResponseSchema,
) {
}
