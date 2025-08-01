import { createZodDto } from 'nestjs-zod';

import { UpdateSubscriptionTemplateCommand } from '@localzet/aura-contract';

export class UpdateTemplateRequestDto extends createZodDto(
    UpdateSubscriptionTemplateCommand.RequestSchema,
) {
}

export class UpdateTemplateResponseDto extends createZodDto(
    UpdateSubscriptionTemplateCommand.ResponseSchema,
) {
}
