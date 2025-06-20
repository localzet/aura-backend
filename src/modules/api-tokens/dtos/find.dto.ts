import { createZodDto } from 'nestjs-zod';

import { FindAllApiTokensCommand } from '@localzet/aura-contract';

export class FindAllApiTokensResponseDto extends createZodDto(
    FindAllApiTokensCommand.ResponseSchema,
) {
}
