import { NODES_CONTROLLER } from '@localzet/aura-contract';
import { ROLE } from '@localzet/aura-contract';

import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Param, UseFilters, UseGuards } from '@nestjs/common';

import { HttpExceptionFilter } from '@common/exception/httpException.filter';
import { JwtDefaultGuard } from '@common/guards/jwt-guards/def-jwt-guard';
import { errorHandler } from '@common/helpers/error-handler.helper';
import { RolesGuard } from '@common/guards/roles/roles.guard';
import { Endpoint } from '@common/decorators/base-endpoint';
import { Roles } from '@common/decorators/roles/roles';
import {
    CreateNodeCommand,
    DeleteNodeCommand,
    DisableNodeCommand,
    EnableNodeCommand,
    GetAllNodesCommand,
    GetOneNodeCommand,
    ReorderNodeCommand,
    RestartAllNodesCommand,
    RestartNodeCommand,
    UpdateNodeCommand,
} from '@localzet/aura-contract';

import {
    CreateNodeRequestDto,
    CreateNodeResponseDto,
    DeleteNodeRequestParamDto,
    DeleteNodeResponseDto,
    DisableNodeRequestParamDto,
    DisableNodeResponseDto,
    EnableNodeRequestParamDto,
    EnableNodeResponseDto,
    GetAllNodesResponseDto,
    GetOneNodeRequestParamDto,
    GetOneNodeResponseDto,
    ReorderNodeRequestDto,
    ReorderNodeResponseDto,
    RestartAllNodesResponseDto,
    RestartNodeRequestDto,
    RestartNodeResponseDto,
    UpdateNodeRequestDto,
    UpdateNodeResponseDto,
} from './dtos';
import { CreateNodeResponseModel, GetAllNodesResponseModel, GetOneNodeResponseModel } from './models';
import { NodesService } from './nodes.service';

@ApiBearerAuth('Authorization')
@ApiTags('Nodes Controller')
@Roles(ROLE.ADMIN, ROLE.API)
@UseGuards(JwtDefaultGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
@Controller(NODES_CONTROLLER)
export class NodesController {
    constructor(private readonly nodesService: NodesService) {
    }

    @ApiCreatedResponse({
        type: CreateNodeResponseDto,
        description: 'Node created successfully',
    })
    @Endpoint({
        command: CreateNodeCommand,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateNodeRequestDto,
    })
    async createNode(@Body() body: CreateNodeRequestDto): Promise<CreateNodeResponseDto> {
        const result = await this.nodesService.createNode(body);

        const data = errorHandler(result);
        return {
            response: new CreateNodeResponseModel(data),
        };
    }

    @ApiOkResponse({
        type: GetAllNodesResponseDto,
        description: 'Nodes fetched',
    })
    @Endpoint({
        command: GetAllNodesCommand,
        httpCode: HttpStatus.OK,
    })
    async getAllNodes(): Promise<GetAllNodesResponseDto> {
        const res = await this.nodesService.getAllNodes();
        const data = errorHandler(res);
        return {
            response: data.map((node) => new GetAllNodesResponseModel(node)),
        };
    }

    @ApiOkResponse({
        type: GetOneNodeResponseDto,
        description: 'Node fetched',
    })
    @ApiParam({ name: 'uuid', type: String, description: 'Node UUID' })
    @Endpoint({
        command: GetOneNodeCommand,
        httpCode: HttpStatus.OK,
    })
    async getOneNode(@Param() uuid: GetOneNodeRequestParamDto): Promise<GetOneNodeResponseDto> {
        const res = await this.nodesService.getOneNode(uuid.uuid);
        const data = errorHandler(res);
        return {
            response: new GetOneNodeResponseModel(data),
        };
    }

    @ApiOkResponse({
        type: EnableNodeResponseDto,
        description: 'Node enabled',
    })
    @ApiParam({ name: 'uuid', type: String, description: 'Node UUID' })
    @Endpoint({
        command: EnableNodeCommand,
        httpCode: HttpStatus.OK,
    })
    async enableNode(@Param() uuid: EnableNodeRequestParamDto): Promise<EnableNodeResponseDto> {
        const res = await this.nodesService.enableNode(uuid.uuid);
        const data = errorHandler(res);
        return {
            response: new GetOneNodeResponseModel(data),
        };
    }

    @ApiOkResponse({
        type: DisableNodeResponseDto,
        description: 'Node disabled',
    })
    @ApiParam({ name: 'uuid', type: String, description: 'Node UUID' })
    @Endpoint({
        command: DisableNodeCommand,
        httpCode: HttpStatus.OK,
    })
    async disableNode(@Param() uuid: DisableNodeRequestParamDto): Promise<DisableNodeResponseDto> {
        const res = await this.nodesService.disableNode(uuid.uuid);
        const data = errorHandler(res);
        return {
            response: new GetOneNodeResponseModel(data),
        };
    }

    @ApiOkResponse({
        type: DeleteNodeResponseDto,
        description: 'Node deleted',
    })
    @ApiParam({ name: 'uuid', type: String, description: 'Node UUID' })
    @Endpoint({
        command: DeleteNodeCommand,
        httpCode: HttpStatus.OK,
    })
    async deleteNode(@Param() uuid: DeleteNodeRequestParamDto): Promise<DeleteNodeResponseDto> {
        const res = await this.nodesService.deleteNode(uuid.uuid);
        const data = errorHandler(res);
        return {
            response: data,
        };
    }

    @ApiOkResponse({
        type: UpdateNodeResponseDto,
        description: 'Node updated',
    })
    @Endpoint({
        command: UpdateNodeCommand,
        httpCode: HttpStatus.OK,
        apiBody: UpdateNodeRequestDto,
    })
    async updateNode(@Body() body: UpdateNodeRequestDto): Promise<UpdateNodeResponseDto> {
        const res = await this.nodesService.updateNode(body);
        const data = errorHandler(res);
        return {
            response: new GetOneNodeResponseModel(data),
        };
    }

    @ApiOkResponse({
        type: RestartNodeResponseDto,
        description: 'Node restarted',
    })
    @ApiParam({ name: 'uuid', type: String, description: 'Node UUID' })
    @Endpoint({
        command: RestartNodeCommand,
        httpCode: HttpStatus.OK,
    })
    async restartNode(@Param() uuid: RestartNodeRequestDto): Promise<RestartNodeResponseDto> {
        const res = await this.nodesService.restartNode(uuid.uuid);
        const data = errorHandler(res);
        return {
            response: data,
        };
    }

    @ApiOkResponse({
        type: RestartAllNodesResponseDto,
        description: 'All nodes restarted',
    })
    @Endpoint({
        command: RestartAllNodesCommand,
        httpCode: HttpStatus.OK,
    })
    async restartAllNodes(): Promise<RestartAllNodesResponseDto> {
        const res = await this.nodesService.restartAllNodes();
        const data = errorHandler(res);
        return {
            response: data,
        };
    }

    @ApiOkResponse({
        type: ReorderNodeResponseDto,
        description: 'Nodes reordered successfully',
    })
    @Endpoint({
        command: ReorderNodeCommand,
        httpCode: HttpStatus.OK,
        apiBody: ReorderNodeRequestDto,
    })
    async reorderNodes(@Body() body: ReorderNodeRequestDto): Promise<ReorderNodeResponseDto> {
        const result = await this.nodesService.reorderNodes(body);

        const data = errorHandler(result);
        return {
            response: data.map((node) => new GetAllNodesResponseModel(node)),
        };
    }
}
