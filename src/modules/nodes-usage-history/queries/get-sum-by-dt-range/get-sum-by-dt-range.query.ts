export class GetSumByDtRangeQuery {
    constructor(
        public readonly start: Date,
        public readonly end: Date,
    ) {
    }
}
