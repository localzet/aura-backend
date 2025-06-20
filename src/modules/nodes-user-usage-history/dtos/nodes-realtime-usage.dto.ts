import { createZodDto } from 'nestjs-zod';

import { GetNodesRealtimeUsageCommand } from '@localzet/aura-contract/commands';

export class GetNodesRealtimeUsageResponseDto extends createZodDto(
    GetNodesRealtimeUsageCommand.ResponseSchema,
) {
}
