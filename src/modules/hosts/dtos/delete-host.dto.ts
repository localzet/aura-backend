import { createZodDto } from 'nestjs-zod';

import { DeleteHostCommand } from '@localzet/aura-contract/commands';

export class DeleteHostRequestDto extends createZodDto(DeleteHostCommand.RequestSchema) {
}

export class DeleteHostResponseDto extends createZodDto(DeleteHostCommand.ResponseSchema) {
}
