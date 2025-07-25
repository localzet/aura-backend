import { Controller, HttpStatus, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@common/exception/httpException.filter';
import { JwtDefaultGuard } from '@common/guards/jwt-guards/def-jwt-guard';
import { errorHandler } from '@common/helpers/error-handler.helper';
import { Endpoint } from '@common/decorators/base-endpoint';
import { Roles } from '@common/decorators/roles/roles';
import { RolesGuard } from '@common/guards/roles';
import { GetNodesUsageByRangeCommand } from '@localzet/aura-contract';
import { NODES_CONTROLLER } from '@localzet/aura-contract';
import { ROLE } from '@localzet/aura-contract';

import { GetNodesUsageByRangeRequestQueryDto, GetNodesUsageByRangeResponseDto } from './dtos';
import { NodesUsageHistoryService } from './nodes-usage-history.service';

@ApiBearerAuth('Authorization')
@ApiTags('Bandwidth stats')
@Roles(ROLE.ADMIN, ROLE.API)
@UseGuards(JwtDefaultGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
@Controller(NODES_CONTROLLER)
export class NodesUsageHistoryController {
    constructor(private readonly nodesUsageHistoryService: NodesUsageHistoryService) {
    }

    @ApiOkResponse({
        type: GetNodesUsageByRangeResponseDto,
        description: 'Nodes usage by range fetched successfully',
    })
    @ApiQuery({
        name: 'end',
        type: Date,
        description: 'End date',
        required: true,
    })
    @ApiQuery({
        name: 'start',
        type: Date,
        description: 'Start date',
        required: true,
    })
    @Endpoint({
        command: GetNodesUsageByRangeCommand,
        httpCode: HttpStatus.OK,
    })
    async getNodesUsageByRange(
        @Query() query: GetNodesUsageByRangeRequestQueryDto,
    ): Promise<GetNodesUsageByRangeResponseDto> {
        const { start, end } = query;

        const result = await this.nodesUsageHistoryService.getNodesUsageByRange(
            new Date(start),
            new Date(end),
        );

        const data = errorHandler(result);
        return {
            response: data,
        };
    }
}
