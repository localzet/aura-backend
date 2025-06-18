import { createZodDto } from 'nestjs-zod';

import { GetAllTagsCommand } from '@localzet/aura-backend-contract/commands';

export class GetAllTagsResponseDto extends createZodDto(GetAllTagsCommand.ResponseSchema) {
}
