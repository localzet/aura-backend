import { createZodDto } from 'nestjs-zod';

import { GetUserByUuidCommand } from '@localzet/aura-backend-contract/commands';

export class GetUserByUuidRequestDto extends createZodDto(GetUserByUuidCommand.RequestSchema) {
}

export class GetUserByUuidResponseDto extends createZodDto(GetUserByUuidCommand.ResponseSchema) {
}
