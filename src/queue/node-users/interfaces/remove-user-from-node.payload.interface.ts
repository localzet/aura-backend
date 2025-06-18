import { RemoveUserCommand as RemoveUserFromNodeCommandSdk } from '@localzet/aura-contract/build/commands';

export interface IRemoveUserFromNodePayload {
    data: RemoveUserFromNodeCommandSdk.Request;
    node: {
        address: string;
        port: number | null;
    };
}
