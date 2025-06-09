export class RemoveInboundsFromUsersByUuidsCommand {
    constructor(public readonly userUuids: string[]) {
    }
}
