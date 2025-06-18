import { createZodDto } from 'nestjs-zod';

import { BulkDeleteUsersByStatusCommand } from '@localzet/aura-backend-contract/commands';

export class BulkDeleteUsersByStatusRequestDto extends createZodDto(
    BulkDeleteUsersByStatusCommand.RequestSchema,
) {
}

export class BulkDeleteUsersByStatusResponseDto extends createZodDto(
    BulkDeleteUsersByStatusCommand.ResponseSchema,
) {
}
