import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { TSubscriptionTemplateType } from '@localzet/aura-contract/constants';

import { UpdateSubscriptionTemplateResponseModel } from './models/update-subscription.response.model';
import { SubscriptionTemplateRepository } from './repositories/subscription-template.repository';
import { GetTemplateResponseModel } from './models/get-template.response.model';

@Injectable()
export class SubscriptionTemplateService {
    private readonly logger = new Logger(SubscriptionTemplateService.name);

    constructor(private readonly subscriptionTemplateRepository: SubscriptionTemplateRepository) {
    }

    public async getTemplate(
        templateType: TSubscriptionTemplateType,
    ): Promise<ICommandResponse<GetTemplateResponseModel>> {
        try {
            const template =
                await this.subscriptionTemplateRepository.findFirstByTemplateType(templateType);

            if (!template) {
                throw new Error('Template not found');
            }

            return {
                isOk: true,
                response: new GetTemplateResponseModel(
                    template.uuid,
                    template.templateType,
                    template.templateJson,
                    template.templateYaml,
                ),
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error('Failed to get template');
        }
    }

    public async updateTemplate(
        templateType: TSubscriptionTemplateType,
        templateJson: object | undefined,
        encodedTemplateYaml: string | undefined,
    ): Promise<ICommandResponse<UpdateSubscriptionTemplateResponseModel>> {
        try {
            const template =
                await this.subscriptionTemplateRepository.findFirstByTemplateType(templateType);

            if (!template) {
                throw new Error('Template not found');
            }

            await this.subscriptionTemplateRepository.update({
                uuid: template.uuid,
                templateType: template.templateType,
                templateJson: templateJson ?? undefined,
                templateYaml: encodedTemplateYaml
                    ? Buffer.from(encodedTemplateYaml, 'base64').toString('utf8')
                    : undefined,
            });

            return {
                isOk: true,
                response: new UpdateSubscriptionTemplateResponseModel(
                    template.uuid,
                    template.templateType,
                    templateJson ?? null,
                    encodedTemplateYaml ?? null,
                ),
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error('Failed to update template');
        }
    }

    public async getJsonTemplateByType(templateType: TSubscriptionTemplateType): Promise<object> {
        try {
            const template =
                await this.subscriptionTemplateRepository.findFirstByTemplateType(templateType);

            if (!template || !template.templateJson) {
                throw new Error('Templates not found');
            }

            return template.templateJson;
        } catch (error) {
            this.logger.error(error);
            throw new Error('Failed to get template');
        }
    }

    public async getYamlTemplateByType(templateType: TSubscriptionTemplateType): Promise<string> {
        try {
            const template =
                await this.subscriptionTemplateRepository.findFirstByTemplateType(templateType);

            if (!template || !template.templateYaml) {
                throw new Error('Template not found');
            }

            return template.templateYaml;
        } catch (error) {
            this.logger.error(error);
            throw new Error('Failed to get template');
        }
    }
}
