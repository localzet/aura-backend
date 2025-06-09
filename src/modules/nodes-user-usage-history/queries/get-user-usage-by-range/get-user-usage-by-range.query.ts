export class GetUserUsageByRangeQuery {
    constructor(
        public readonly userUuid: string,
        public readonly start: Date,
        public readonly end: Date,
    ) {
    }
}
