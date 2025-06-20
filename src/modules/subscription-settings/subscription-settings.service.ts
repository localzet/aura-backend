import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract';

import { SubscriptionSettingsRepository } from './repositories/subscription-settings.repository';
import { SubscriptionSettingsEntity } from './entities/subscription-settings.entity';
import { UpdateSubscriptionSettingsRequestDto } from './dtos';

@Injectable()
export class SubscriptionSettingsService {
    private readonly logger = new Logger(SubscriptionSettingsService.name);

    constructor(private readonly subscriptionSettingsRepository: SubscriptionSettingsRepository) {
    }

    public async getSubscriptionSettings(): Promise<ICommandResponse<SubscriptionSettingsEntity>> {
        try {
            const settings = await this.subscriptionSettingsRepository.findFirst();

            if (!settings) {
                return {
                    isOk: false,
                    ...ERRORS.SUBSCRIPTION_SETTINGS_NOT_FOUND,
                };
            }

            return {
                isOk: true,
                response: settings,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_SUBSCRIPTION_SETTINGS_ERROR,
            };
        }
    }

    public async updateSettings(
        dto: UpdateSubscriptionSettingsRequestDto,
    ): Promise<ICommandResponse<SubscriptionSettingsEntity>> {
        try {
            const settings = await this.subscriptionSettingsRepository.findByUUID(dto.uuid);

            if (!settings) {
                return {
                    isOk: false,
                    ...ERRORS.SUBSCRIPTION_SETTINGS_NOT_FOUND,
                };
            }

            const updatedSettings = await this.subscriptionSettingsRepository.update({
                ...dto,
            });

            return {
                isOk: true,
                response: updatedSettings,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.UPDATE_SUBSCRIPTION_SETTINGS_ERROR,
            };
        }
    }
}
