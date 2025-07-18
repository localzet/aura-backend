import { Body, Controller, HttpStatus, Param, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@common/exception/httpException.filter';
import { JwtDefaultGuard } from '@common/guards/jwt-guards/def-jwt-guard';
import { errorHandler } from '@common/helpers/error-handler.helper';
import { Endpoint } from '@common/decorators/base-endpoint';
import { Roles } from '@common/decorators/roles/roles';
import { RolesGuard } from '@common/guards/roles';
import { CreateApiTokenCommand, DeleteApiTokenCommand, FindAllApiTokensCommand } from '@localzet/aura-contract';
import { API_TOKENS_CONTROLLER } from '@localzet/aura-contract';
import { ROLE } from '@localzet/aura-contract';

import {
    CreateApiTokenRequestDto,
    CreateApiTokenResponseDto,
    DeleteApiTokenRequestDto,
    DeleteApiTokenResponseDto,
    FindAllApiTokensResponseDto,
} from './dtos';
import { ApiTokensService } from './api-tokens.service';
import { CreateApiTokenResponseModel } from './models';

@ApiBearerAuth('Authorization')
@ApiTags('API Tokens Management')
@Roles(ROLE.ADMIN)
@UseGuards(JwtDefaultGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
@Controller(API_TOKENS_CONTROLLER)
export class ApiTokensController {
    constructor(private readonly apiTokensService: ApiTokensService) {
    }

    @ApiResponse({
        status: 201,
        description: 'Token created successfully',
        type: CreateApiTokenResponseDto,
    })
    @Endpoint({
        command: CreateApiTokenCommand,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateApiTokenRequestDto,
    })
    async create(@Body() body: CreateApiTokenRequestDto): Promise<CreateApiTokenResponseDto> {
        const result = await this.apiTokensService.create(body);

        const data = errorHandler(result);
        return {
            response: new CreateApiTokenResponseModel(data),
        };
    }

    @ApiParam({ name: 'uuid', type: String, description: 'UUID of the API token' })
    @ApiResponse({
        status: 200,
        description: 'Token deleted successfully',
        type: DeleteApiTokenResponseDto,
    })
    @Endpoint({
        command: DeleteApiTokenCommand,
        httpCode: HttpStatus.OK,
    })
    async delete(@Param() paramData: DeleteApiTokenRequestDto): Promise<DeleteApiTokenResponseDto> {
        const result = await this.apiTokensService.delete(paramData.uuid);
        const data = errorHandler(result);
        return {
            response: data.result,
        };
    }

    @ApiResponse({
        status: 200,
        description: 'Tokens fetched successfully',
        type: FindAllApiTokensResponseDto,
    })
    @Endpoint({
        command: FindAllApiTokensCommand,
        httpCode: HttpStatus.OK,
    })
    async findAll(): Promise<FindAllApiTokensResponseDto> {
        const result = await this.apiTokensService.findAll();
        const data = errorHandler(result);
        return {
            response: data,
        };
    }
}
