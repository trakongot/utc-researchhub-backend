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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from 'nestjs-zod';
import { ReqWithRequester } from 'src/common/interface';
import {
  CreateStudentDto,
  FindStudentDto,
  UpdateStudentDto,
} from './student.dto.ts';
import { StudentService } from './student.service';

@ApiTags('Students')
@Controller('students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new student',
    description: 'Creates a new student account',
  })
  @ApiBody({
    schema: {},
    description: 'Student information',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Student created successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body(new ZodValidationPipe(CreateStudentDto))
    dto: CreateStudentDto,
    @Request() req: ReqWithRequester,
  ) {
    try {
      const result = await this.service.create(dto);
      return {
        data: result,
        message: 'Tạo sinh viên thành công',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      // Error will be caught by the global exception filter
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get student by ID',
    description: 'Retrieves student details by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student retrieved successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    return {
      data: result,
      message: 'Lấy thông tin sinh viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('profile/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'View student public profile',
    description: 'Retrieves the public profile of a student by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  async getPublicProfile(@Param('id') id: string) {
    const result = await this.service.get(id);
    return {
      data: result,
      message: 'Lấy thông tin sinh viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('profile/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current student profile',
    description: 'Retrieves the profile of the currently logged in student',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    schema: {},
  })
  async getProfile(@Request() req: ReqWithRequester) {
    // The user ID is obtained from the authenticated user in the request
    const userId = req.requester.sub;
    const result = await this.service.get(userId);
    return {
      data: result,
      message: 'Lấy thông tin cá nhân thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all students',
    description:
      'Retrieves a paginated list of students with filtering options',
  })
  @ApiQuery({ name: 'studentCode', required: false, type: String })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'departmentId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED_OUT', 'ON_LEAVE'],
  })
  @ApiQuery({ name: 'majorCode', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['fullName', 'studentCode', 'email', 'createdAt'],
  })
  @ApiQuery({ name: 'asc', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Students retrieved successfully',
    schema: {},
  })
  async find(
    @Query(new ZodValidationPipe(FindStudentDto))
    query: FindStudentDto,
  ) {
    const result = await this.service.find(query);
    return {
      data: result.data,
      paging: result.paging,
      total: result.total,
      message: 'Thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update student',
    description: 'Updates student information',
  })
  @ApiBody({
    schema: {},
    description: 'Student information to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student updated successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateStudentDto))
    dto: UpdateStudentDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.update(id, dto);
    return {
      data: result,
      message: 'Cập nhật sinh viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch('profile/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current student profile',
    description: 'Updates the profile of the currently logged in student',
  })
  @ApiBody({
    schema: {},
    description: 'Student information to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    schema: {},
  })
  async updateProfile(
    @Body(new ZodValidationPipe(UpdateStudentDto))
    dto: UpdateStudentDto,
    @Request() req: ReqWithRequester,
  ) {
    // The user ID is obtained from the authenticated user in the request
    const userId = req.requester.sub;
    const result = await this.service.update(userId, dto);
    return {
      data: result,
      message: 'Cập nhật thông tin cá nhân thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student', description: 'Deletes a student' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Student deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
