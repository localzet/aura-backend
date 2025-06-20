import { createZodDto } from 'nestjs-zod';

import { GetUserByEmailCommand } from '@localzet/aura-contract';

export class GetUserByEmailRequestDto extends createZodDto(GetUserByEmailCommand.RequestSchema) {
}

export class GetUserByEmailResponseDto extends createZodDto(GetUserByEmailCommand.ResponseSchema) {
}
