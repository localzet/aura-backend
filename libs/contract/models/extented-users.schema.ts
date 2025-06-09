import { z } from 'zod';

import { LastConnectedNodeSchema } from './last-connected-node.schema';
import { UsersSchema } from './users.schema';
import { HappSchema } from './happ.schema';

export const ExtendedUsersSchema = UsersSchema.extend({
    subscriptionUrl: z.string(),
    lastConnectedNode: LastConnectedNodeSchema,
    happ: HappSchema,
});
