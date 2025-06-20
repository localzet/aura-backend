import { createZodDto } from 'nestjs-zod';

import { GetAllTagsCommand } from '@localzet/aura-contract';

export class GetAllTagsResponseDto extends createZodDto(GetAllTagsCommand.ResponseSchema) {
}
