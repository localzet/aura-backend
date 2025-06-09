export class AddInboundsToUsersByUuidsCommand {
    constructor(
        public readonly userUuids: string[],
        public readonly inboundUuids: string[],
    ) {
    }
}
