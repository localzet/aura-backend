import { UserTrafficHistoryEntity } from '../../entities/user-traffic-history.entity';

export class CreateUserTrafficHistoryCommand {
    constructor(public readonly userTrafficHistory: UserTrafficHistoryEntity) {
    }
}
