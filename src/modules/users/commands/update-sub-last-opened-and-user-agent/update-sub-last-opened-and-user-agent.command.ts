export class UpdateSubLastOpenedAndUserAgentCommand {
    constructor(
        public readonly userUuid: string,
        public readonly subLastOpenedAt: Date,
        public readonly subLastUserAgent: string,
    ) {
    }
}
