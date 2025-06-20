import { createZodDto } from 'nestjs-zod';

import { GetPubKeyCommand } from '@localzet/aura-contract';

export class GetPubKeyResponseDto extends createZodDto(GetPubKeyCommand.ResponseSchema) {
}
