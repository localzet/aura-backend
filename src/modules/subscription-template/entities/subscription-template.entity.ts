import { SubscriptionTemplate } from '@prisma/client';

import { TSubscriptionTemplateType } from '@localzet/aura-contract/constants';

export class SubscriptionTemplateEntity implements SubscriptionTemplate {
    uuid: string;
    templateType: TSubscriptionTemplateType;
    templateYaml: string | null;
    templateJson: object | null;

    createdAt: Date;
    updatedAt: Date;

    constructor(config: Partial<SubscriptionTemplate>) {
        Object.assign(this, config);
        return this;
    }
}
