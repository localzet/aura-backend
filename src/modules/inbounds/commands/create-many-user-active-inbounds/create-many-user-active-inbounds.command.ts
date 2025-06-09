export class CreateManyUserActiveInboundsCommand {
    constructor(
        public readonly userUuid: string,
        public readonly inboundUuids: string[],
    ) {
    }
}
