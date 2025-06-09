export class KeygenResponseModel {
    public pubKey: string;

    constructor(payload: string) {
        this.pubKey = payload;
    }
}
