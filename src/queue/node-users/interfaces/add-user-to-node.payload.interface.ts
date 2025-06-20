import { AddUserCommand as AddUserToNodeCommandSdk } from '@localzet/aura-contract';

export interface IAddUserToNodePayload {
    data: AddUserToNodeCommandSdk.Request;
    node: {
        address: string;
        port: number | null;
    };
}
