export class CheckHwidExistsQuery {
    constructor(
        public readonly hwid: string,
        public readonly userUuid: string,
    ) {
    }
}
