import { TRolesKeys } from '@localzet/aura-backend-contract/constants';

export interface IJWTAuthPayload {
    role: TRolesKeys;
    username: null | string;
    uuid: null | string;
}
