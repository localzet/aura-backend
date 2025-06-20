import { TRolesKeys } from '@localzet/aura-contract/constants';

export interface IJWTAuthPayload {
    role: TRolesKeys;
    username: null | string;
    uuid: null | string;
}
