export class BulkDeleteByStatusResponseModel {
    public readonly affectedRows: number;

    constructor(affectedRows: number) {
        this.affectedRows = affectedRows;
    }
}
