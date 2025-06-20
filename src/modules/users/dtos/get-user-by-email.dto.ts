import { createZodDto } from 'nestjs-zod';

import { GetUserByEmailCommand } from '@localzet/aura-contract/commands';

export class GetUserByEmailRequestDto extends createZodDto(GetUserByEmailCommand.RequestSchema) {
}

export class GetUserByEmailResponseDto extends createZodDto(GetUserByEmailCommand.ResponseSchema) {
}
