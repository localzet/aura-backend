import { InboundsEntity } from '../../inbounds/entities/inbounds.entity';
import { HostsEntity } from './hosts.entity';

export class HostWithInboundTagEntity extends HostsEntity {
    public inboundTag: InboundsEntity;

    constructor(data: HostWithInboundTagEntity) {
        super(data);
        this.inboundTag = data.inboundTag;
    }
}
