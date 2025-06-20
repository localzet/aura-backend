import { createZodDto } from 'nestjs-zod';

import { GetOneHostCommand } from '@localzet/aura-contract';

export class GetOneHostRequestDto extends createZodDto(GetOneHostCommand.RequestSchema) {
}

export class GetOneHostResponseDto extends createZodDto(GetOneHostCommand.ResponseSchema) {
}
