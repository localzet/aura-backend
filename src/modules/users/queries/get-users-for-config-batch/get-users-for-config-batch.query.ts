import { InboundsEntity } from '@modules/inbounds/entities';

export class GetUsersForConfigBatchQuery {
    constructor(
        public readonly excludedInbounds: InboundsEntity[],
        public readonly limit: number,
        public readonly offset: number,
    ) {
    }
}
