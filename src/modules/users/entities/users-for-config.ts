export class UserForConfigEntity {
    public username: string;
    public trojanPassword: string;
    public vlessUuid: string;
    public ssPassword: string;
    public tags: string[];

    constructor(data: UserForConfigEntity) {
        this.username = data.username;
        this.trojanPassword = data.trojanPassword;
        this.vlessUuid = data.vlessUuid;
        this.ssPassword = data.ssPassword;
        this.tags = data.tags;
    }
}
