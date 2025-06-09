import { createZodDto } from 'nestjs-zod';

import { UpdateSubscriptionTemplateCommand } from '@libs/contracts/commands';

export class UpdateTemplateRequestDto extends createZodDto(
    UpdateSubscriptionTemplateCommand.RequestSchema,
) {
}

export class UpdateTemplateResponseDto extends createZodDto(
    UpdateSubscriptionTemplateCommand.ResponseSchema,
) {
}
