import { createZodDto } from 'nestjs-zod';

import { DeleteUserHwidDeviceCommand } from '@localzet/aura-backend-contract/commands';

export class DeleteUserHwidDeviceRequestDto extends createZodDto(
    DeleteUserHwidDeviceCommand.RequestSchema,
) {
}

export class DeleteUserHwidDeviceResponseDto extends createZodDto(
    DeleteUserHwidDeviceCommand.ResponseSchema,
) {
}
