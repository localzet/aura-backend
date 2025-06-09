import { NodesEntity } from '../../entities';

export class GetNodesByCriteriaQuery {
    constructor(public readonly criteria: Partial<NodesEntity>) {
    }
}
