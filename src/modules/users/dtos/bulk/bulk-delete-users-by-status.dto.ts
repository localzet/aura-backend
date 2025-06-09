import { createZodDto } from 'nestjs-zod';

import { BulkDeleteUsersByStatusCommand } from '@libs/contracts/commands';

export class BulkDeleteUsersByStatusRequestDto extends createZodDto(
    BulkDeleteUsersByStatusCommand.RequestSchema,
) {
}

export class BulkDeleteUsersByStatusResponseDto extends createZodDto(
    BulkDeleteUsersByStatusCommand.ResponseSchema,
) {
}
