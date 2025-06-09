export class IncrementUsedTrafficCommand {
    constructor(
        public readonly userUuid: string,
        public readonly bytes: bigint,
    ) {
    }
}
