import { createZodDto } from 'nestjs-zod';

import { FindAllApiTokensCommand } from '@libs/contracts/commands';

export class FindAllApiTokensResponseDto extends createZodDto(
    FindAllApiTokensCommand.ResponseSchema,
) {
}
