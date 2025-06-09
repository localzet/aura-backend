import { createZodDto } from 'nestjs-zod';

import { DeleteUserHwidDeviceCommand } from '@contract/commands';

export class DeleteUserHwidDeviceRequestDto extends createZodDto(
    DeleteUserHwidDeviceCommand.RequestSchema,
) {
}

export class DeleteUserHwidDeviceResponseDto extends createZodDto(
    DeleteUserHwidDeviceCommand.ResponseSchema,
) {
}
