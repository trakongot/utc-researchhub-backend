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
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ApiResponse } from 'src/common/responses';

import {
  CreateLecturerSelectionDto,
  createLecturerSelectionDtoSchema,
  FindLecturerSelectionDto,
  findLecturerSelectionDtoSchema,
  UpdateLecturerSelectionDto,
  updateLecturerSelectionDtoSchema,
} from './lecturer-selection.dto';
import { LecturerSelectionService } from './lecturer-selection.service';

@ApiTags('Lecturer Selection')
@Controller('lecturer-selection')
@ApiBearerAuth()
export class LecturerSelectionController {
  constructor(private readonly service: LecturerSelectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new lecturer selection' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        position: {
          type: 'number',
          example: 1,
        },
        studyFieldId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        topicTitle: {
          type: 'string',
          example: 'Nghiên cứu mạng nơ-ron nhân tạo',
        },
        description: {
          type: 'string',
          example: 'Mô tả chi tiết về đề tài nghiên cứu',
          nullable: true,
        },
        fieldPoolId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        capacity: {
          type: 'number',
          example: 5,
        },
        currentCapacity: {
          type: 'number',
          example: 0,
        },
      },
      required: ['position', 'studyFieldId', 'topicTitle', 'lecturerId'],
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lecturer selection created successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body(new ZodValidationPipe(createLecturerSelectionDtoSchema))
    dto: CreateLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.create(dto, 'req.user.id');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a lecturer selection by ID' })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Lecturer selection found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lecturer selection not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async get(@Param('id') id: string): Promise<ApiResponse<any>> {
    return {
      success: true,
      message: 'Lấy thông tin giảng viên thành công',
      data: await this.service.get(id),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find lecturer selections with filtering options' })
  @ApiQuery({
    name: 'studyFieldId',
    required: false,
    description: 'Study field ID',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Search by topic title',
  })
  @ApiQuery({ name: 'lecturerId', required: false, description: 'Lecturer ID' })
  @ApiQuery({
    name: 'asc',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['createdAt', 'updatedAt', 'priority'],
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
  @ApiQuery({
    name: 'fieldPoolId',
    required: false,
    type: String,
    description: 'Field pool ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Status',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Is active',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'List of lecturer selections',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameter format',
  })
  async find(
    @Query(new ZodValidationPipe(findLecturerSelectionDtoSchema))
    query: FindLecturerSelectionDto,
  ) {
    return this.service.find(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a lecturer selection' })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        position: {
          type: 'number',
          example: 2,
        },
        studyFieldId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        topicTitle: {
          type: 'string',
          example: 'Nghiên cứu cập nhật về mạng nơ-ron nhân tạo',
        },
        description: {
          type: 'string',
          example: 'Mô tả cập nhật về đề tài nghiên cứu',
          nullable: true,
        },
      },
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Lecturer selection updated successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lecturer selection not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or ID format',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have permission to update this selection',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLecturerSelectionDtoSchema))
    dto: UpdateLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    return {
      success: true,
      message: 'Cập nhật thành công',
      data: await this.service.update(id, dto, 'req.user.id'),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a lecturer selection' })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Lecturer selection deleted successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lecturer selection not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async delete(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.service.delete(id);
    return {
      success: true,
      message: 'Xóa thành công',
      data: null,
    };
  }
}
