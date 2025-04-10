import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

import { ReqWithRequester } from 'src/common/interface';
import { ZodValidationPipe } from 'src/common/pipe/zod-validation.pipe';
import { ApiResponse } from 'src/common/response';

import { ProjectAllocationService } from './project-allocation.service';
import {
  CreateProjectAllocationDto,
  createProjectAllocationDtoSchema,
  FindProjectAllocationDto,
  findProjectAllocationDtoSchema,
  UpdateProjectAllocationDto,
  updateProjectAllocationDtoSchema,
} from './schema';

@ApiTags('Project Allocation')
@Controller('project-allocation')
@ApiBearerAuth('access-token')
export class ProjectAllocationController {
  constructor(private readonly service: ProjectAllocationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project allocation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        lecturerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        topicTitle: {
          type: 'string',
          example: 'Nghiên cứu ứng dụng AI trong y tế',
        },
      },
      required: ['studentId', 'lecturerId', 'topicTitle'],
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project allocation created successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body(new ZodValidationPipe(createProjectAllocationDtoSchema))
    dto: CreateProjectAllocationDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.create(dto, 'req.user.id');
    return {
      success: true,
      message: 'Tạo phân công đề tài thành công',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a project allocation by ID' })
  @ApiParam({ name: 'id', description: 'Project Allocation ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Project allocation found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project allocation not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find project allocations with filtering options' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Student ID' })
  @ApiQuery({ name: 'lecturerId', required: false, description: 'Lecturer ID' })
  @ApiQuery({ name: 'topicTitle', required: false, description: 'Topic title' })
  @ApiQuery({
    name: 'allocatedAtStart',
    required: false,
    description: 'Allocation start date',
  })
  @ApiQuery({
    name: 'allocatedAtEnd',
    required: false,
    description: 'Allocation end date',
  })
  @ApiQuery({
    name: 'asc',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['allocatedAt', 'createdAt', 'updatedAt'],
    description: 'Field to order by',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'departmentId',
    required: false,
    type: String,
    description: 'Department ID',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'List of project allocations',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameter format',
  })
  async find(
    @Query(new ZodValidationPipe(findProjectAllocationDtoSchema))
    query: FindProjectAllocationDto,
  ) {
    return this.service.find(query, query.page, query.limit);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a project allocation' })
  @ApiParam({ name: 'id', description: 'Project Allocation ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        lecturerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        topicTitle: {
          type: 'string',
          example: 'Nghiên cứu ứng dụng AI trong y tế - cập nhật',
        },
      },
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Project allocation updated successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project allocation not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or ID format',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProjectAllocationDtoSchema))
    dto: UpdateProjectAllocationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a project allocation' })
  @ApiParam({ name: 'id', description: 'Project Allocation ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Project allocation deleted successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project allocation not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async delete(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.service.delete(id);
    return {
      success: true,
      message: 'Xóa phân công đề tài thành công',
      data: null,
    };
  }
}
