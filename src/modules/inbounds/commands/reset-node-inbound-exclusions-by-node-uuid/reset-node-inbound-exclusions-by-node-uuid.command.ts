export class ResetNodeInboundExclusionsByNodeUuidCommand {
    constructor(
        public readonly nodeUuid: string,
        public readonly excludedInbounds: string[],
    ) {
    }
}
