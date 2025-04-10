import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
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
import { ProjectT } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { PermissionT } from 'src/common/constant/permissions';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequirePermissions } from 'src/modules/auth/permission.decorator';
import { PermissionGuard } from 'src/modules/auth/permission.guard';
import { ResearchService } from './research.service';
import { AddCommentDto } from './schema';

@ApiTags('Research')
@Controller('research')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get research statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns research statistics',
  })
  @RequirePermissions(PermissionT.VIEW_PROPOSALS)
  async getStatistics() {
    return this.researchService.getStatistics();
  }

  @Get('by-department')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get research projects by department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns research projects grouped by department',
  })
  @RequirePermissions(PermissionT.VIEW_PROPOSALS)
  async getResearchByDepartment() {
    return this.researchService.getResearchByDepartment();
  }

  @Post('projects/:projectId/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a comment to a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment added successfully',
  })
  @RequirePermissions(PermissionT.VIEW_PROPOSALS)
  async addProjectComment(
    @Param('projectId') projectId: string,
    @Body(new ZodValidationPipe(AddCommentDto)) dto: AddCommentDto,
    @Request() req,
  ) {
    return this.researchService.addProjectComment(
      projectId,
      req.user.id,
      req.user.userType,
      dto.content,
    );
  }

  @Get('projects/:projectId/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comments for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns project comments',
  })
  @RequirePermissions(PermissionT.VIEW_PROPOSALS)
  async getProjectComments(@Param('projectId') projectId: string) {
    return this.researchService.getProjectComments(projectId);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for research projects' })
  @ApiQuery({ name: 'query', description: 'Search query' })
  @ApiQuery({
    name: 'type',
    description: 'Project type',
    enum: ProjectT,
    required: false,
  })
  @ApiQuery({
    name: 'departmentId',
    description: 'Department ID',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns search results',
  })
  @RequirePermissions(PermissionT.VIEW_PROPOSALS)
  async searchProjects(
    @Query('query') query: string,
    @Query('type', new ParseEnumPipe(ProjectT, { optional: true }))
    type?: ProjectT,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.researchService.searchProjects(query, type, departmentId);
  }
}
