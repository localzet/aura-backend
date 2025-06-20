import { createZodDto } from 'nestjs-zod';

import { UpdateXrayConfigCommand } from '@localzet/aura-contract';

export class UpdateConfigRequestDto extends createZodDto(UpdateXrayConfigCommand.RequestSchema) {
}

export class UpdateConfigResponseDto extends createZodDto(UpdateXrayConfigCommand.ResponseSchema) {
}
