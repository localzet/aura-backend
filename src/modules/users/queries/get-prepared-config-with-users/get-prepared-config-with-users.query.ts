import { InboundsEntity } from '@modules/inbounds/entities';

export class GetPreparedConfigWithUsersQuery {
    constructor(
        public readonly excludedInbounds: InboundsEntity[],
        public readonly excludeInboundsFromConfig: boolean = true,
    ) {
    }
}
