import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionTemplateCommand } from '@libs/contracts/commands';

export class GetTemplateResponseDto extends createZodDto(
    GetSubscriptionTemplateCommand.ResponseSchema,
) {
}

export class GetTemplateRequestDto extends createZodDto(
    GetSubscriptionTemplateCommand.RequestSchema,
) {
}
