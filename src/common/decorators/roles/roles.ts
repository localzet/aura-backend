import { SetMetadata } from '@nestjs/common';

import { ROLE, TRolesKeys } from '@localzet/aura-backend-contract/constants';

export const Roles = (...roles: TRolesKeys[]) => SetMetadata(ROLE, roles);
