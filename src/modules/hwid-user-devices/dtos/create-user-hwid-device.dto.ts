import { createZodDto } from 'nestjs-zod';

import { CreateUserHwidDeviceCommand } from '@localzet/aura-contract';

export class CreateUserHwidDeviceRequestDto extends createZodDto(
    CreateUserHwidDeviceCommand.RequestSchema,
) {
}

export class CreateUserHwidDeviceResponseDto extends createZodDto(
    CreateUserHwidDeviceCommand.ResponseSchema,
) {
}
