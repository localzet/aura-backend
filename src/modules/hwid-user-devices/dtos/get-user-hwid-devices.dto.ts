import { createZodDto } from 'nestjs-zod';

import { GetUserHwidDevicesCommand } from '@localzet/aura-contract';

export class GetUserHwidDevicesRequestDto extends createZodDto(
    GetUserHwidDevicesCommand.RequestSchema,
) {
}

export class GetUserHwidDevicesResponseDto extends createZodDto(
    GetUserHwidDevicesCommand.ResponseSchema,
) {
}
