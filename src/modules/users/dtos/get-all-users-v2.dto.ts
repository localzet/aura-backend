import { createZodDto } from 'nestjs-zod';

import { GetAllUsersCommand } from '@localzet/aura-backend-contract/commands';

export class GetAllUsersQueryDto extends createZodDto(GetAllUsersCommand.RequestQuerySchema) {
}

export class GetAllUsersResponseDto extends createZodDto(GetAllUsersCommand.ResponseSchema) {
}
