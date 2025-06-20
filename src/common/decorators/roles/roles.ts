import { SetMetadata } from '@nestjs/common';

import { ROLE, TRolesKeys } from '@localzet/aura-contract';

export const Roles = (...roles: TRolesKeys[]) => SetMetadata(ROLE, roles);
