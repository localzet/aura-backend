import { InboundObject } from '@common/helpers/xray-config/interfaces/protocols.config';

import { InboundsEntity } from '@modules/inbounds/entities';

export const getVlessFlow = (inbound: InboundObject) => {
    if (
        (inbound.streamSettings?.network === 'tcp' || inbound.streamSettings?.network === 'raw') &&
        (inbound.streamSettings?.security === 'reality' ||
            inbound.streamSettings?.security === 'tls')
    ) {
        return 'xtls-rprx-vision';
    }

    return '';
};

export const getVlessFlowFromDbInbound = (inbound: InboundsEntity) => {
    if (
        (inbound.network === 'tcp' || inbound.network === 'raw') &&
        (inbound.security === 'reality' || inbound.security === 'tls')
    ) {
        return 'xtls-rprx-vision';
    }

    return '';
};
