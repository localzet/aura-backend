import { HwidUserDeviceEntity } from '../../entities/hwid-user-device.entity';

export class UpsertHwidUserDeviceCommand {
    constructor(public readonly hwidUserDevice: HwidUserDeviceEntity) {
    }
}
