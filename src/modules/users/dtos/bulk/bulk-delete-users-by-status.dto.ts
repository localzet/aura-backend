import { createZodDto } from 'nestjs-zod';

import { BulkDeleteUsersByStatusCommand } from '@localzet/aura-contract';

export class BulkDeleteUsersByStatusRequestDto extends createZodDto(
    BulkDeleteUsersByStatusCommand.RequestSchema,
) {
}

export class BulkDeleteUsersByStatusResponseDto extends createZodDto(
    BulkDeleteUsersByStatusCommand.ResponseSchema,
) {
}
