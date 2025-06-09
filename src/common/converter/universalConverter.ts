import { IConverter } from '../types/converter.interface';

export class UniversalConverter<T, U> implements IConverter<T, U> {
    private readonly entityFactory: (model: U) => T;
    private readonly modelFactory: (entity: T) => U;

    constructor(entityFactory: (model: U) => T, modelFactory: (entity: T) => U) {
        this.entityFactory = entityFactory;
        this.modelFactory = modelFactory;
    }

    fromPrismaModelToEntity(prismaModel: U): T {
        return this.entityFactory(prismaModel);
    }

    fromPrismaModelToEntityOrNull(prismaModel: null | U): null | T {
        return prismaModel != null ? this.fromPrismaModelToEntity(prismaModel) : null;
    }

    fromPrismaModelsToEntities(prismaModels: U[]): T[] {
        return prismaModels.map((model) => this.fromPrismaModelToEntity(model));
    }

    fromEntityToPrismaModel(entity: T): U {
        return this.modelFactory(entity);
    }

    fromEntitiesToPrismaModels(entities: T[]): U[] {
        return entities.map((entity) => this.fromEntityToPrismaModel(entity));
    }
}
