export function RequireAdminId() {
    return function <T extends { adminId: string | undefined }>(
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>,
    ) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function(this: T, ...args: any[]): Promise<void> {
            if (!this.adminId) {
                return;
            }

            return await originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
