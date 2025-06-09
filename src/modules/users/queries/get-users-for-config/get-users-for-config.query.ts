import { InboundsEntity } from '@modules/inbounds/entities';

export class GetUsersForConfigQuery {
    constructor(public readonly excludedInbounds: InboundsEntity[]) {
    }
}
