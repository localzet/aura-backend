import { RemoveUserCommand as RemoveUserFromNodeCommandSdk } from '@localzet/aura-contract';

export interface IRemoveUserFromNodePayload {
    data: RemoveUserFromNodeCommandSdk.Request;
    node: {
        address: string;
        port: number | null;
    };
}
