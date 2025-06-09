export class DeleteHostResponseModel {
    public isDeleted: boolean;

    constructor(data: DeleteHostResponseModel) {
        this.isDeleted = data.isDeleted;
    }
}
