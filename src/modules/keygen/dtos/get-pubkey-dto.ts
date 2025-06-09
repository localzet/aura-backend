import { createZodDto } from 'nestjs-zod';

import { GetPubKeyCommand } from '@libs/contracts/commands';

export class GetPubKeyResponseDto extends createZodDto(GetPubKeyCommand.ResponseSchema) {
}
