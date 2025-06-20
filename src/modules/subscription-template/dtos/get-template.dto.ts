import { createZodDto } from 'nestjs-zod';

import { GetSubscriptionTemplateCommand } from '@localzet/aura-contract';

export class GetTemplateResponseDto extends createZodDto(
    GetSubscriptionTemplateCommand.ResponseSchema,
) {
}

export class GetTemplateRequestDto extends createZodDto(
    GetSubscriptionTemplateCommand.RequestSchema,
) {
}
