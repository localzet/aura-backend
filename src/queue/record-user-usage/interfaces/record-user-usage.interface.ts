export interface RecordUserUsagePayload {
    nodeUuid: string;
    nodeAddress: string;
    nodePort: number | null;
    consumptionMultiplier: string;
}
