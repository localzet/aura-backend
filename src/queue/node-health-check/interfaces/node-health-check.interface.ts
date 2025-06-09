export interface NodeHealthCheckPayload {
    nodeUuid: string;
    nodeAddress: string;
    nodePort: number | null;
    isConnected: boolean;
    isConnecting: boolean;
}
