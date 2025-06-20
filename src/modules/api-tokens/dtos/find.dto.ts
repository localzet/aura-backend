import { createZodDto } from 'nestjs-zod';

import { FindAllApiTokensCommand } from '@localzet/aura-contract/commands';

export class FindAllApiTokensResponseDto extends createZodDto(
    FindAllApiTokensCommand.ResponseSchema,
) {
}
