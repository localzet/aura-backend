export class BulkOperationResponseModel {
    public readonly affectedRows: number;

    constructor(affectedRows: number) {
        this.affectedRows = affectedRows;
    }
}
