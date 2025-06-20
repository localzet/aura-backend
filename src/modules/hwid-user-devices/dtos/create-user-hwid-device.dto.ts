import { createZodDto } from 'nestjs-zod';

import { CreateUserHwidDeviceCommand } from '@localzet/aura-contract/commands';

export class CreateUserHwidDeviceRequestDto extends createZodDto(
    CreateUserHwidDeviceCommand.RequestSchema,
) {
}

export class CreateUserHwidDeviceResponseDto extends createZodDto(
    CreateUserHwidDeviceCommand.ResponseSchema,
) {
}
