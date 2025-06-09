export class DeleteNodeResponseModel {
    public isDeleted: boolean;

    constructor(data: DeleteNodeResponseModel) {
        this.isDeleted = data.isDeleted;
    }
}
