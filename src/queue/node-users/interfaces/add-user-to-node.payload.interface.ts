import { AddUserCommand as AddUserToNodeCommandSdk } from '@localzet/aura-node-contract/build/commands';

export interface IAddUserToNodePayload {
    data: AddUserToNodeCommandSdk.Request;
    node: {
        address: string;
        port: number | null;
    };
}
