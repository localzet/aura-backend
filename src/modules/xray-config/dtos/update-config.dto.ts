import { createZodDto } from 'nestjs-zod';

import { UpdateXrayConfigCommand } from '@libs/contracts/commands';

export class UpdateConfigRequestDto extends createZodDto(UpdateXrayConfigCommand.RequestSchema) {
}

export class UpdateConfigResponseDto extends createZodDto(UpdateXrayConfigCommand.ResponseSchema) {
}
