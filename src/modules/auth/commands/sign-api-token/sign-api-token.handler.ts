import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { ICommandResponse } from '@common/types/command-response.type';
import { ROLE } from '@localzet/aura-contract';

import { SignApiTokenCommand } from './sign-api-token.command';
import { IJWTAuthPayload } from '../../interfaces';

@CommandHandler(SignApiTokenCommand)
export class SignApiTokenHandler
    implements ICommandHandler<SignApiTokenCommand, ICommandResponse<string>> {
    constructor(private readonly jwtService: JwtService) {
    }

    async execute(command: SignApiTokenCommand): Promise<ICommandResponse<string>> {
        const payload: IJWTAuthPayload = {
            uuid: command.uuid,
            username: null,
            role: ROLE.API,
        };

        return {
            isOk: true,
            response: this.jwtService.sign(payload, {
                expiresIn: '99999d',
            }),
        };
    }
}
