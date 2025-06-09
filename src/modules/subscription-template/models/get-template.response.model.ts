import { TSubscriptionTemplateType } from '@libs/contracts/constants';

export class GetTemplateResponseModel {
    public uuid: string;
    public templateType: TSubscriptionTemplateType;
    public templateJson: object | null;
    public encodedTemplateYaml: string | null;

    constructor(
        uuid: string,
        templateType: TSubscriptionTemplateType,
        templateJson: object | null,
        encodedTemplateYaml: string | null,
    ) {
        this.uuid = uuid;
        this.templateType = templateType;
        this.templateJson = templateJson;
        this.encodedTemplateYaml = encodedTemplateYaml
            ? Buffer.from(encodedTemplateYaml, 'utf8').toString('base64')
            : null;
    }
}
