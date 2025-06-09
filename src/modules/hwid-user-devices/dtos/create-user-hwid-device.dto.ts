import { createZodDto } from 'nestjs-zod';

import { CreateUserHwidDeviceCommand } from '@contract/commands';

export class CreateUserHwidDeviceRequestDto extends createZodDto(
    CreateUserHwidDeviceCommand.RequestSchema,
) {
}

export class CreateUserHwidDeviceResponseDto extends createZodDto(
    CreateUserHwidDeviceCommand.ResponseSchema,
) {
}
