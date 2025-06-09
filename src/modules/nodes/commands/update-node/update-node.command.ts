import { NodesEntity } from '../../entities/nodes.entity';

export class UpdateNodeCommand {
    constructor(public readonly node: Partial<NodesEntity>) {
    }
}
