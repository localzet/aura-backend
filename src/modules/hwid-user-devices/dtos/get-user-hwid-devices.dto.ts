import { createZodDto } from 'nestjs-zod';

import { GetUserHwidDevicesCommand } from '@contract/commands';

export class GetUserHwidDevicesRequestDto extends createZodDto(
    GetUserHwidDevicesCommand.RequestSchema,
) {
}

export class GetUserHwidDevicesResponseDto extends createZodDto(
    GetUserHwidDevicesCommand.ResponseSchema,
) {
}
