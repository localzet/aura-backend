import { InboundsWithTagsAndType } from '../../interfaces/inbounds-with-tags-and-type.interface';

export class CreateManyInboundsCommand {
    constructor(public readonly inbounds: InboundsWithTagsAndType[]) {
    }
}
