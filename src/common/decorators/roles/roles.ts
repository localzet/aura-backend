import { SetMetadata } from '@nestjs/common';

import { ROLE, TRolesKeys } from '@libs/contracts/constants';

export const Roles = (...roles: TRolesKeys[]) => SetMetadata(ROLE, roles);
