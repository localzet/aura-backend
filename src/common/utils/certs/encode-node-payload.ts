interface INodePayload {
    nodeCertPem: string;
    nodeKeyPem: string;
    caCertPem: string;
    jwtPublicKey: string;
}

export function encodeCertPayload(payload: INodePayload): string {
    const json = JSON.stringify(payload);
    return Buffer.from(json, 'utf-8').toString('base64');
}
