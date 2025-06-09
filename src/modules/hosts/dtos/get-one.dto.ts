import { createZodDto } from 'nestjs-zod';

import { GetOneHostCommand } from '@libs/contracts/commands';

export class GetOneHostRequestDto extends createZodDto(GetOneHostCommand.RequestSchema) {
}

export class GetOneHostResponseDto extends createZodDto(GetOneHostCommand.ResponseSchema) {
}
