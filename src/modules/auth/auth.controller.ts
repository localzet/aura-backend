import { ApiForbiddenResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, UseFilters } from '@nestjs/common';

import { HttpExceptionFilter } from '@common/exception/httpException.filter';
import { UserAgent } from '@common/decorators/get-useragent/get-useragent';
import { errorHandler } from '@common/helpers/error-handler.helper';
import { IpAddress } from '@common/decorators/get-ip/get-ip';
import { Endpoint } from '@common/decorators/base-endpoint';
import { GetStatusCommand, LoginCommand, RegisterCommand, TelegramCallbackCommand } from '@localzet/aura-backend-contract/commands';
import { AUTH_CONTROLLER } from '@localzet/aura-backend-contract/api/controllers/auth';

import {
    GetStatusResponseDto,
    LoginRequestDto,
    LoginResponseDto,
    RegisterRequestDto,
    RegisterResponseDto,
    TelegramCallbackRequestDto,
    TelegramCallbackResponseDto,
} from './dtos';
import { RegisterResponseModel } from './model/register.response.model';
import { AuthResponseModel } from './model/auth-response.model';
import { AuthService } from './auth.service';

@ApiTags('Auth Controller')
@UseFilters(HttpExceptionFilter)
@Controller(AUTH_CONTROLLER)
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiResponse({ type: LoginResponseDto, description: 'Access token for further requests' })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid credentials',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Invalid credentials' },
                error: { type: 'string', example: 'Unauthorized' },
            },
        },
    })
    @Endpoint({
        command: LoginCommand,
        httpCode: HttpStatus.OK,
        apiBody: LoginRequestDto,
    })
    async login(
        @Body() body: LoginRequestDto,
        @IpAddress() ip: string,
        @UserAgent() userAgent: string,
    ): Promise<LoginResponseDto> {
        const result = await this.authService.login(body, ip, userAgent);

        const data = errorHandler(result);
        return {
            response: new AuthResponseModel(data),
        };
    }

    @ApiForbiddenResponse({
        description: 'Forbidden - Registration is not allowed',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 403 },
                message: { type: 'string', example: 'Registration is not allowed' },
                error: { type: 'string', example: 'Forbidden' },
            },
        },
    })
    @ApiResponse({ type: RegisterResponseDto, description: 'Access token for further requests' })
    @Endpoint({
        command: RegisterCommand,
        httpCode: HttpStatus.CREATED,
        apiBody: RegisterRequestDto,
    })
    async register(@Body() body: RegisterRequestDto): Promise<RegisterResponseDto> {
        const result = await this.authService.register(body);

        const data = errorHandler(result);
        return {
            response: new RegisterResponseModel(data),
        };
    }

    @ApiResponse({ type: GetStatusResponseDto, description: 'Status of the system' })
    @Endpoint({
        command: GetStatusCommand,
        httpCode: HttpStatus.OK,
    })
    async getStatus(): Promise<GetStatusResponseDto> {
        const result = await this.authService.getStatus();

        const data = errorHandler(result);
        return {
            response: data,
        };
    }

    @ApiResponse({
        type: TelegramCallbackResponseDto,
        description: 'Access token for further requests',
    })
    @Endpoint({
        command: TelegramCallbackCommand,
        httpCode: HttpStatus.OK,
        apiBody: TelegramCallbackRequestDto,
    })
    async telegramCallback(
        @Body() body: TelegramCallbackRequestDto,
        @IpAddress() ip: string,
        @UserAgent() userAgent: string,
    ): Promise<TelegramCallbackResponseDto> {
        const result = await this.authService.telegramCallback(body, ip, userAgent);

        const data = errorHandler(result);
        return {
            response: new AuthResponseModel(data),
        };
    }
}
