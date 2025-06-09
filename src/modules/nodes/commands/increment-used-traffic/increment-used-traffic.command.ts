export class IncrementUsedTrafficCommand {
    constructor(
        public readonly nodeUuid: string,
        public readonly bytes: bigint,
    ) {
    }
}
