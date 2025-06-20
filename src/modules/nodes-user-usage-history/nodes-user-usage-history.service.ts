import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@common/types/command-response.type';
import { ERRORS } from '@localzet/aura-contract/constants';

import { NodesUserUsageHistoryRepository } from './repositories/nodes-user-usage-history.repository';
import { IGetNodesRealtimeUsage, IGetNodeUserUsageByRange } from './interfaces';

dayjs.extend(utc);
dayjs.extend(relativeTime);

@Injectable()
export class NodesUserUsageHistoryService {
    private readonly logger = new Logger(NodesUserUsageHistoryService.name);

    constructor(private readonly nodeUserUsageHistoryRepository: NodesUserUsageHistoryRepository) {
    }

    public async getNodesUserUsageByRange(
        uuid: string,
        start: Date,
        end: Date,
    ): Promise<ICommandResponse<IGetNodeUserUsageByRange[]>> {
        try {
            const startDate = dayjs(start).utc().toDate();
            const endDate = dayjs(end).utc().toDate();

            const result = await this.nodeUserUsageHistoryRepository.getNodeUsersUsageByRange(
                uuid,
                startDate,
                endDate,
            );

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_NODES_USER_USAGE_BY_RANGE_ERROR,
            };
        }
    }

    public async getNodesRealtimeUsage(): Promise<ICommandResponse<IGetNodesRealtimeUsage[]>> {
        try {
            const result = await this.nodeUserUsageHistoryRepository.getNodesRealtimeUsage();

            return {
                isOk: true,
                response: result,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                isOk: false,
                ...ERRORS.GET_NODES_REALTIME_USAGE_ERROR,
            };
        }
    }
}
