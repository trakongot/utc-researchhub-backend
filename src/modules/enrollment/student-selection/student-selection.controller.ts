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
import {
  CreateStudentSelectionDto,
  createStudentSelectionDtoSchema,
  FindStudentSelectionDto,
  findStudentSelectionDtoSchema,
  UpdateStudentSelectionDto,
  updateStudentSelectionDtoSchema,
} from './schema';
import { StudentSelectionService } from './student-selection.service';

@ApiTags('Student Advising Preferences')
@ApiBearerAuth('access-token')
@Controller('/student-advising-preferences')
export class StudentSelectionController {
  constructor(private readonly service: StudentSelectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new student selection preference' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        facultyMemberId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        fieldId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174002',
        },
      },
      required: ['studentId', 'facultyMemberId', 'fieldId'],
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    description: 'Student selection preference created successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body(new ZodValidationPipe(createStudentSelectionDtoSchema))
    dto: CreateStudentSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a student selection preference by ID' })
  @ApiParam({ name: 'id', description: 'Student Selection Preference ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Student selection preference found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student selection preference not found',
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
  @ApiOperation({
    summary: 'Find student selection preferences with filtering options',
  })
  @ApiQuery({ name: 'studentId', required: false, description: 'Student ID' })
  @ApiQuery({
    name: 'facultyMemberId',
    required: false,
    description: 'Faculty Member ID',
  })
  @ApiQuery({ name: 'fieldId', required: false, description: 'Field ID' })
  @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['createdAt', 'updatedAt'],
    description: 'Field to order by',
  })
  @ApiQuery({
    name: 'asc',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
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
    description: 'Department ID',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'List of student selection preferences',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameter format',
  })
  async find(
    @Query(new ZodValidationPipe(findStudentSelectionDtoSchema))
    query: FindStudentSelectionDto,
  ) {
    return this.service.find(query, query.page, query.limit);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a student selection preference' })
  @ApiParam({ name: 'id', description: 'Student Selection Preference ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        facultyMemberId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        fieldId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174002',
        },
      },
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Student selection preference updated successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student selection preference not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or ID format',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSelectionDtoSchema))
    dto: UpdateStudentSelectionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a student selection preference' })
  @ApiParam({ name: 'id', description: 'Student Selection Preference ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Student selection preference deleted successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student selection preference not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
