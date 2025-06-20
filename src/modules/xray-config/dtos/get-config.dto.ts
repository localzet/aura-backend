import { createZodDto } from 'nestjs-zod';

import { GetXrayConfigCommand } from '@localzet/aura-contract/commands';

export class GetConfigResponseDto extends createZodDto(GetXrayConfigCommand.ResponseSchema) {
}
