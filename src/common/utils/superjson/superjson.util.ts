import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';
import superjson from 'superjson';

export function serializeCustom<T>(data: T): string {
    return superjson.stringify(instanceToPlain(data));
}

export function deserialize<T>(data: string, type: ClassConstructor<T>): T {
    return plainToInstance(type, superjson.parse(data));
}
