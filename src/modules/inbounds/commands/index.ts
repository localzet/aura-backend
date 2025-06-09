import { ResetNodeInboundExclusionByNodeUuidHandler } from './reset-node-inbound-exclusions-by-node-uuid';
import { DeleteManyActiveInboundsByUserUuidHandler } from './delete-many-active-inbounds-by-user-uuid';
import { RemoveInboundsFromUsersByUuidsHandler } from './remove-inbounds-from-users-by-uuids';
import { CreateManyUserActiveInboundsHandler } from './create-many-user-active-inbounds';
import { AddInboundsToUsersByUuidsHandler } from './add-inbounds-to-users-by-uuids';
import { UpdateInboundHandler } from './update-inbound/update-inbound.handler';
import { DeleteManyInboundsHandler } from './delete-many-inbounds';
import { CreateManyInboundsHandler } from './create-many-inbounds';

export const COMMANDS = [
    DeleteManyInboundsHandler,
    CreateManyInboundsHandler,
    CreateManyUserActiveInboundsHandler,
    DeleteManyActiveInboundsByUserUuidHandler,
    ResetNodeInboundExclusionByNodeUuidHandler,
    UpdateInboundHandler,
    RemoveInboundsFromUsersByUuidsHandler,
    AddInboundsToUsersByUuidsHandler,
];
