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
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { PermissionT } from 'src/common/constant/permissions';
import { ReqWithRequester } from 'src/common/interface';
import { ZodValidationPipe } from 'src/common/pipe/zod-validation.pipe';
import { ApiResponse, generateApiResponse } from 'src/common/response';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequirePermissions } from 'src/modules/auth/permission.decorator';
import { PermissionGuard } from 'src/modules/auth/permission.guard';
import {
  CreateStudentSelectionDto,
  FindStudentSelectionDto,
  UpdateStudentSelectionDto,
  UpdateStudentSelectionStatusDto,
  createStudentSelectionDtoSchema,
  findStudentSelectionDtoSchema,
  updateStudentSelectionDtoSchema,
  updateStudentSelectionStatusDtoSchema,
} from './schema';
import { StudentSelectionService } from './student-selection.service';

@ApiTags('Student Selection')
@Controller('student-selection')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StudentSelectionController {
  constructor(private readonly service: StudentSelectionService) {}

  @Post()
  @RequirePermissions(PermissionT.CREATE_STUDENT_SELECTION)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Student] Create a new selection preference' })
  @SwaggerApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async create(
    @Body(new ZodValidationPipe(createStudentSelectionDtoSchema))
    dto: CreateStudentSelectionDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.create(dto, req.requester.id);
    return generateApiResponse(
      'Sinh viên đăng ký nguyện vọng thành công',
      result,
    );
  }

  @Get('me')
  @RequirePermissions(PermissionT.VIEW_OWN_STUDENT_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Student] Get my selection preferences' })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async findMine(
    @Query(new ZodValidationPipe(findStudentSelectionDtoSchema))
    query: FindStudentSelectionDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const specificQuery = { ...query, studentId: req.requester.id };
    const result = await this.service.find(specificQuery, req.requester);
    return generateApiResponse('Lấy danh sách nguyện vọng thành công', result);
  }

  @Get(':id')
  @RequirePermissions(PermissionT.VIEW_STUDENT_SELECTION_DETAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Student, Lecturer, TBM, Dean] Get a student selection by ID',
  })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async get(@Param('id') id: string): Promise<ApiResponse<any>> {
    const data = await this.service.get(id);
    return generateApiResponse(
      'Lấy thông tin đăng ký nguyện vọng thành công',
      data,
    );
  }

  @Get()
  @RequirePermissions(PermissionT.VIEW_STUDENT_SELECTION_LIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[All Roles] Find student selections (filtered by role)',
  })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async find(
    @Query(new ZodValidationPipe(findStudentSelectionDtoSchema))
    query: FindStudentSelectionDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.find(query, req.requester);
    return generateApiResponse('Lấy danh sách nguyện vọng thành công', result);
  }

  @Patch(':id')
  @RequirePermissions(PermissionT.UPDATE_STUDENT_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Student] Update own selection preference content',
  })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async updateByOwner(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSelectionDtoSchema))
    dto: UpdateStudentSelectionDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const updatedSelection = await this.service.updateByOwner(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse(
      'Cập nhật đăng ký nguyện vọng thành công',
      updatedSelection,
    );
  }

  @Patch(':id/status/admin')
  @RequirePermissions(PermissionT.UPDATE_STUDENT_SELECTION_STATUS)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[TBM, Dean] Update student selection status (Admin)',
  })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Status updated' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async updateStatusByAdmin(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSelectionStatusDtoSchema))
    dto: UpdateStudentSelectionStatusDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.updateStatusByAdmin(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse(
      'Cập nhật trạng thái nguyện vọng thành công',
      result,
    );
  }

  @Patch(':id/status/lecturer')
  @RequirePermissions(PermissionT.UPDATE_STUDENT_SELECTION_AS_LECTURER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Lecturer] Update student selection status as lecturer',
  })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Status updated' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async updateStatusByLecturer(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSelectionStatusDtoSchema))
    dto: UpdateStudentSelectionStatusDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.updateStatusByLecturer(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse(
      'Cập nhật trạng thái nguyện vọng thành công',
      result,
    );
  }

  @Patch(':id/status/owner')
  @RequirePermissions(PermissionT.UPDATE_OWN_STUDENT_SELECTION_STATUS)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Student] Update own selection status' })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Status updated' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async updateStatusByOwner(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSelectionStatusDtoSchema))
    dto: UpdateStudentSelectionStatusDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.updateStatusByOwner(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse(
      'Cập nhật trạng thái nguyện vọng thành công',
      result,
    );
  }

  @Delete(':id')
  @RequirePermissions(PermissionT.DELETE_OWN_STUDENT_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Student] Delete own selection preference' })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Deleted' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  async deleteByOwner(
    @Param('id') id: string,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    await this.service.deleteByOwner(id, req.requester.id);
    return generateApiResponse('Xóa đăng ký nguyện vọng thành công', null);
  }

  @Delete(':id/admin')
  @RequirePermissions(PermissionT.DELETE_STUDENT_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[TBM, Dean] Delete any student selection (Admin)' })
  @ApiParam({ name: 'id', description: 'Student Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Deleted' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async deleteByAdmin(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.service.deleteByAdmin(id);
    return generateApiResponse('Xóa đăng ký nguyện vọng thành công', null);
  }
}
