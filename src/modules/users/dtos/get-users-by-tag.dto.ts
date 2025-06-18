import { createZodDto } from 'nestjs-zod';

import { GetUserByTagCommand } from '@localzet/aura-backend-contract/commands';

export class GetUserByTagRequestDto extends createZodDto(GetUserByTagCommand.RequestSchema) {
}

export class GetUserByTagResponseDto extends createZodDto(GetUserByTagCommand.ResponseSchema) {
}
