import { UpdateUserRequestDto } from '@modules/users/dtos';

export class UpdateUserWithServiceCommand {
    constructor(public readonly dto: UpdateUserRequestDto) {
    }
}
