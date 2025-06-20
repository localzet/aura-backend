import { createZodDto } from 'nestjs-zod';

import { GetUserByTagCommand } from '@localzet/aura-contract';

export class GetUserByTagRequestDto extends createZodDto(GetUserByTagCommand.RequestSchema) {
}

export class GetUserByTagResponseDto extends createZodDto(GetUserByTagCommand.ResponseSchema) {
}
