export class GetUsersByExpireAtQuery {
    constructor(
        public readonly start: Date,
        public readonly end: Date,
    ) {
    }
}
