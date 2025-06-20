import { TRolesKeys } from '@localzet/aura-contract';

export interface IJWTAuthPayload {
    role: TRolesKeys;
    username: null | string;
    uuid: null | string;
}
