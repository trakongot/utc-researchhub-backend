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
  CreateFacultyDto,
  CreateFacultyRoleDto,
  FindFacultyDto,
  UpdateFacultyDto,
} from './faculty.dto';
import { FacultyService } from './faculty.service';

@ApiTags('Faculties')
@Controller('faculties')
@ApiBearerAuth()
export class FacultyController {
  constructor(private readonly service: FacultyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new faculty',
    description: 'Creates a new faculty account',
  })
  @ApiBody({ schema: {}, description: 'Faculty information' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Faculty created successfully',
    schema: {},
  })
  async create(
    @Body(new ZodValidationPipe(CreateFacultyDto))
    dto: CreateFacultyDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.create(dto);
    return {
      data: result,
      message: 'Tạo giảng viên thành công',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get faculty by ID',
    description: 'Retrieves faculty details by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Faculty retrieved successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    return {
      data: result,
      message: 'Lấy thông tin giảng viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('profile/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'View faculty public profile',
    description: 'Retrieves the public profile of a faculty member by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async getPublicProfile(@Param('id') id: string) {
    const result = await this.service.get(id);
    return {
      data: result,
      message: 'Lấy thông tin giảng viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('profile/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current faculty profile',
    description:
      'Retrieves the profile of the currently logged in faculty member',
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
    summary: 'Get all faculties',
    description:
      'Retrieves a paginated list of faculties with filtering options',
  })
  @ApiQuery({ name: 'facultyCode', required: false, type: String })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'departmentId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'INACTIVE', 'RETIRED', 'RESIGNED', 'ON_LEAVE'],
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: [
      'ADMIN',
      'DEAN',
      'DEPARTMENT_HEAD',
      'SECRETARY',
      'LECTURER',
      'ADVISOR',
    ],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['fullName', 'facultyCode', 'email', 'createdAt'],
  })
  @ApiQuery({ name: 'asc', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Faculties retrieved successfully',
    schema: {},
  })
  async find(
    @Query(new ZodValidationPipe(FindFacultyDto))
    query: FindFacultyDto,
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
    summary: 'Update faculty',
    description: 'Updates faculty information',
  })
  @ApiBody({
    schema: {},
    description: 'Faculty information to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Faculty updated successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFacultyDto))
    dto: UpdateFacultyDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.update(id, dto);
    return {
      data: result,
      message: 'Cập nhật giảng viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch('profile/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current faculty profile',
    description:
      'Updates the profile of the currently logged in faculty member',
  })
  @ApiBody({
    schema: {},
    description: 'Faculty information to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    schema: {},
  })
  async updateProfile(
    @Body(new ZodValidationPipe(UpdateFacultyDto))
    dto: UpdateFacultyDto,
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
  @ApiOperation({
    summary: 'Delete faculty',
    description: 'Deletes a faculty member',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Faculty deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add role to faculty',
    description: 'Adds a role to a faculty member',
  })
  @ApiBody({ schema: {}, description: 'Role to add' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role added successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async addRole(
    @Param('id') id: string,
    @Body('role')
    role:
      | 'ADMIN'
      | 'DEAN'
      | 'DEPARTMENT_HEAD'
      | 'SECRETARY'
      | 'LECTURER'
      | 'ADVISOR',
  ) {
    const dto: CreateFacultyRoleDto = {
      facultyId: id,
      role,
    };

    const result = await this.service.addRole(dto);
    return {
      data: result,
      message: 'Thêm vai trò cho giảng viên thành công',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete(':id/roles/:role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove role from faculty',
    description: 'Removes a role from a faculty member',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role removed successfully',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async removeRole(@Param('id') id: string, @Param('role') role: string) {
    const result = await this.service.removeRole(id, role);
    return {
      data: result,
      message: 'Xóa vai trò của giảng viên thành công',
      statusCode: HttpStatus.OK,
    };
  }
}
