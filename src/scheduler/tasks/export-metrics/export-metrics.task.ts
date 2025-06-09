import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Gauge } from 'prom-client';

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueryBus } from '@nestjs/cqrs';

import { resolveCountryEmoji } from '@common/utils/resolve-country-emoji';
import { ICommandResponse } from '@common/types/command-response.type';
import { METRIC_NAMES } from '@libs/contracts/constants';

import { GetShortUserStatsQuery } from '@modules/users/queries/get-short-user-stats/get-short-user-stats.query';
import { GetAllNodesQuery } from '@modules/nodes/queries/get-all-nodes/get-all-nodes.query';
import { ShortUserStats } from '@modules/users/interfaces/user-stats.interface';
import { NodesEntity } from '@modules/nodes/entities/nodes.entity';

import { JOBS_INTERVALS } from '@scheduler/intervals';

@Injectable()
export class ExportMetricsTask {
    private static readonly CRON_NAME = 'exportMetrics';
    private readonly logger = new Logger(ExportMetricsTask.name);

    private cachedUserStats: ShortUserStats | null;
    private lastUserStatsUpdateTime: number;
    private readonly CACHE_TTL_MS: number;

    constructor(
        @InjectMetric(METRIC_NAMES.USERS_STATUS) public usersStatus: Gauge<string>,
        @InjectMetric(METRIC_NAMES.USERS_TOTAL) public usersTotal: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_ONLINE_USERS) public nodeOnlineUsers: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_STATUS) public nodeStatus: Gauge<string>,
        private readonly queryBus: QueryBus,
    ) {
        this.lastUserStatsUpdateTime = 0;
        this.CACHE_TTL_MS = 60000;
        this.cachedUserStats = null;
    }

    @Cron(JOBS_INTERVALS.METRIC_EXPORT_METRICS, {
        name: ExportMetricsTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            await this.reportShortUserStats();
            await this.reportNodesStats();
        } catch (error) {
            this.logger.error(`Error in ExportMetricsTask: ${error}`);
        }
    }

    private async reportShortUserStats() {
        try {
            const currentTime = Date.now();
            const shouldUpdateCache =
                !this.cachedUserStats ||
                currentTime - this.lastUserStatsUpdateTime > this.CACHE_TTL_MS;

            if (shouldUpdateCache) {
                // this.logger.debug('Updating user stats cache from database...');
                const usersResponse = await this.getShortUserStats();

                if (!usersResponse.isOk || !usersResponse.response) {
                    return;
                }

                this.cachedUserStats = usersResponse.response;
                this.lastUserStatsUpdateTime = currentTime;

                // this.logger.debug(
                //     `User stats cache updated successfully at ${new Date().toISOString()}`,
                // );
            } else {
                // this.logger.debug('Using cached user stats (less than 1 minute old)');
            }

            if (this.cachedUserStats) {
                const stats = this.cachedUserStats;

                Object.entries(stats.statusCounts.statusCounts).forEach(([status, count]) => {
                    this.usersStatus.set({ status }, count);
                });

                this.usersTotal.set({ type: 'all' }, stats.statusCounts.totalUsers);

                // this.logger.debug(
                //     `Short users stats metrics updated from ${shouldUpdateCache ? 'fresh' : 'cached'} data.`,
                // );
            }
        } catch (error) {
            this.logger.error(`Error in reportShortUserStats: ${error}`);
        }
    }

    private async reportNodesStats() {
        try {
            const nodesResponse = await this.getAllNodes();
            if (!nodesResponse.isOk || !nodesResponse.response) {
                return;
            }

            const nodes = nodesResponse.response;

            nodes.forEach((node) => {
                this.nodeOnlineUsers.set(
                    {
                        node_uuid: node.uuid,
                        node_name: node.name,
                        node_country_emoji: resolveCountryEmoji(node.countryCode),
                    },
                    node.usersOnline ?? 0,
                );

                this.nodeStatus.set(
                    {
                        node_uuid: node.uuid,
                        node_name: node.name,
                        node_country_emoji: resolveCountryEmoji(node.countryCode),
                    },
                    node.isConnected ? 1 : 0,
                );
            });
        } catch (error) {
            this.logger.error(`Error in reportNodesStats: ${error}`);
        }
    }

    private async getShortUserStats(): Promise<ICommandResponse<ShortUserStats>> {
        return this.queryBus.execute<GetShortUserStatsQuery, ICommandResponse<ShortUserStats>>(
            new GetShortUserStatsQuery(),
        );
    }

    private async getAllNodes(): Promise<ICommandResponse<NodesEntity[]>> {
        return this.queryBus.execute<GetAllNodesQuery, ICommandResponse<NodesEntity[]>>(
            new GetAllNodesQuery(),
        );
    }
}
