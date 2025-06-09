import { TRolesKeys } from '@libs/contracts/constants';

export interface IJWTAuthPayload {
    role: TRolesKeys;
    username: null | string;
    uuid: null | string;
}
