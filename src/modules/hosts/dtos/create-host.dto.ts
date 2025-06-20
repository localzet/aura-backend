import { createZodDto } from 'nestjs-zod';

import { CreateHostCommand } from '@localzet/aura-contract/commands';

export class CreateHostRequestDto extends createZodDto(CreateHostCommand.RequestSchema) {
}

export class CreateHostResponseDto extends createZodDto(CreateHostCommand.ResponseSchema) {
}
