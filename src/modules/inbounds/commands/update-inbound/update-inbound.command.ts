import { InboundsEntity } from '../../entities/inbounds.entity';

export class UpdateInboundCommand {
    constructor(public readonly inbound: InboundsEntity) {
    }
}
