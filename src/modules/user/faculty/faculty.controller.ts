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
  UseGuards,
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
import { PermissionGuard } from 'src/modules/auth/permission.guard';

import { PermissionT } from 'src/common/constant';
import { ReqWithRequester } from 'src/common/interface';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequirePermissions } from 'src/modules/auth/permission.decorator';
import { FacultyService } from './faculty.service';
import {
  CreateFacultyDto,
  CreateFacultyRoleDto,
  FacultyResponseDto,
  FindFacultyDto,
  UpdateFacultyDto,
} from './schema';

@ApiTags('Faculties')
@Controller('faculties')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('')
export class FacultyController {
  constructor(private readonly service: FacultyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new faculty',
    description: 'Creates a new faculty account',
  })
  @ApiBody({ type: CreateFacultyDto, description: 'Faculty information' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Faculty created successfully',
    type: FacultyResponseDto,
  })
  @UseGuards(PermissionGuard)
  async create(
    @Body(new ZodValidationPipe(CreateFacultyDto))
    dto: CreateFacultyDto,
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
    type: FacultyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  @RequirePermissions(PermissionT.VIEW_FACULTY)
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
    type: FacultyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  @RequirePermissions(PermissionT.VIEW_FACULTY)
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
    type: FacultyResponseDto,
  })
  async getProfile(@Request() req: ReqWithRequester) {
    return await this.service.get(req.requester.id);
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
    type: FacultyResponseDto,
    isArray: true,
  })
  @RequirePermissions(PermissionT.VIEW_FACULTY)
  async find(
    @Query(new ZodValidationPipe(FindFacultyDto))
    query: FindFacultyDto,
  ) {
    return await this.service.find(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update faculty',
    description: 'Updates faculty information',
  })
  @ApiBody({
    type: UpdateFacultyDto,
    description: 'Faculty information to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Faculty updated successfully',
    type: FacultyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  @RequirePermissions(PermissionT.MANAGE_FACULTY)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFacultyDto))
    dto: UpdateFacultyDto,
    @Request() req: ReqWithRequester,
  ) {
    return await this.service.update(id, dto);
  }

  @Patch('profile/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current faculty profile',
    description:
      'Updates the profile of the currently logged in faculty member',
  })
  @ApiBody({
    type: UpdateFacultyDto,
    description: 'Faculty information to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: FacultyResponseDto,
  })
  async updateProfile(
    @Body(new ZodValidationPipe(UpdateFacultyDto))
    dto: UpdateFacultyDto,
    @Request() req: ReqWithRequester,
  ) {
    const userId = req.requester.id;
    return await this.service.update(userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete faculty',
    description: 'Deletes a faculty account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Faculty deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  @RequirePermissions(PermissionT.MANAGE_FACULTY)
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return {
      message: 'Xóa giảng viên thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add role to faculty',
    description: 'Adds a role to a faculty member',
  })
  @ApiBody({
    type: CreateFacultyRoleDto,
    description: 'Role to add',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role added successfully',
    type: FacultyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  @RequirePermissions(PermissionT.MANAGE_FACULTY_ROLES)
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
    const result = await this.service.addRole(id, role as any);
    return {
      data: result,
      message: 'Thêm vai trò thành công',
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
    type: FacultyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty or role not found',
  })
  @RequirePermissions(PermissionT.MANAGE_FACULTY_ROLES)
  async removeRole(@Param('id') id: string, @Param('role') role: string) {
    const result = await this.service.removeRole(id, role);
    return {
      data: result,
      message: 'Xóa vai trò thành công',
      statusCode: HttpStatus.OK,
    };
  }
}
