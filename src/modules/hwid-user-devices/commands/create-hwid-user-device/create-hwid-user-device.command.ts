import { HwidUserDeviceEntity } from '../../entities/hwid-user-device.entity';

export class CreateHwidUserDeviceCommand {
    constructor(public readonly hwidUserDevice: HwidUserDeviceEntity) {
    }
}
