import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserT } from '@prisma/client';
import { PermissionT } from 'src/common/constant/permissions';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequirePermissions } from 'src/modules/auth/permission.decorator';
import { PermissionGuard } from 'src/modules/auth/permission.guard';
import { LogService } from './log.service';

@ApiTags('Logs')
@Controller('logs')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('entity/:entityType/:entityId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs for a specific entity' })
  @ApiParam({
    name: 'entityType',
    description: 'Type of entity (e.g., PROJECT, TASK)',
  })
  @ApiParam({ name: 'entityId', description: 'ID of the entity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns logs for the entity',
  })
  @RequirePermissions(PermissionT.APPROVE_PROPOSAL)
  async getLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.logService.getLogsByEntity(entityType, entityId);
  }

  @Get('user/:userType/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs created by a specific user' })
  @ApiParam({ name: 'userType', enum: UserT, description: 'Type of user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns logs created by the user',
  })
  @RequirePermissions(PermissionT.APPROVE_PROPOSAL)
  async getLogsByUser(
    @Param('userType', new ParseEnumPipe(UserT)) userType: UserT,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.logService.getLogsByUser(userId, userType);
  }

  @Get('department/:departmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs for a specific department' })
  @ApiParam({ name: 'departmentId', description: 'ID of the department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns logs for the department',
  })
  @RequirePermissions(PermissionT.APPROVE_PROPOSAL)
  async getLogsByDepartment(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ) {
    return this.logService.getLogsByDepartment(departmentId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns logs for the current user',
  })
  async getMyLogs(@Request() req) {
    return this.logService.getLogsByUser(req.user.id, req.user.userType);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search logs' })
  @ApiQuery({ name: 'query', description: 'Search query' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for search',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for search',
  })
  @ApiQuery({
    name: 'entityType',
    required: false,
    description: 'Entity type filter',
  })
  @ApiQuery({ name: 'action', required: false, description: 'Action filter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns search results',
  })
  @RequirePermissions(PermissionT.APPROVE_PROPOSAL)
  async searchLogs(
    @Query('query') query: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
  ) {
    const startDateTime = startDate ? new Date(startDate) : undefined;
    const endDateTime = endDate ? new Date(endDate) : undefined;

    return this.logService.searchLogs(
      query,
      startDateTime,
      endDateTime,
      entityType,
      action,
    );
  }
}
