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
import { LecturerSelectionService } from './lecturer-selection.service';
import {
  CreateLecturerSelectionDto,
  FindLecturerSelectionDto,
  UpdateLecturerSelectionDto,
  UpdateLecturerSelectionStatusDto,
  createLecturerSelectionDtoSchema,
  findLecturerSelectionDtoSchema,
  updateLecturerSelectionDtoSchema,
  updateLecturerSelectionStatusDtoSchema,
} from './schema';

@ApiTags('Lecturer Selection')
@Controller('lecturer-selection')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class LecturerSelectionController {
  constructor(private readonly service: LecturerSelectionService) {}

  @Post()
  @RequirePermissions(PermissionT.CREATE_LECTURER_SELECTION)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Lecturer] Create a new lecturer selection topic' })
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
    @Body(new ZodValidationPipe(createLecturerSelectionDtoSchema))
    dto: CreateLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.create(dto, req.requester.id);
    return generateApiResponse('Giảng viên đăng ký đề tài thành công', result);
  }

  @Get('me')
  @RequirePermissions(PermissionT.VIEW_OWN_LECTURER_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Lecturer] Get my lecturer selections' })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async findMine(
    @Query(new ZodValidationPipe(findLecturerSelectionDtoSchema))
    query: FindLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    const specificQuery = { ...query, lecturerId: req.requester.id };
    return this.service.find(specificQuery, req.requester);
  }

  @Get(':id')
  @RequirePermissions(PermissionT.VIEW_LECTURER_SELECTION_DETAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Lecturer, TBM, Dean] Get a lecturer selection by ID',
  })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async get(
    @Param('id') id: string,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.get(id);
    return generateApiResponse('Lấy thông tin đăng ký đề tài thành công', data);
  }

  @Get()
  @RequirePermissions(PermissionT.VIEW_LECTURER_SELECTION_LIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[All Roles] Find lecturer selections (filtered by role)',
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
    @Query(new ZodValidationPipe(findLecturerSelectionDtoSchema))
    query: FindLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.find(query, req.requester);
  }

  @Patch(':id')
  @RequirePermissions(PermissionT.UPDATE_LECTURER_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Lecturer] Update own lecturer selection content' })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID', type: String })
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
    @Body(new ZodValidationPipe(updateLecturerSelectionDtoSchema))
    dto: UpdateLecturerSelectionDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const updatedSelection = await this.service.updateByOwner(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse(
      'Cập nhật đăng ký đề tài thành công',
      updatedSelection,
    );
  }

  @Patch(':id/status/admin')
  @RequirePermissions(PermissionT.UPDATE_LECTURER_SELECTION_STATUS)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[TBM, Dean] Update lecturer selection status (Admin)',
  })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID', type: String })
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
    @Body(new ZodValidationPipe(updateLecturerSelectionStatusDtoSchema))
    dto: UpdateLecturerSelectionStatusDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.updateStatusByAdmin(id, dto);
    return generateApiResponse('Cập nhật trạng thái đề tài thành công', result);
  }

  @Patch(':id/status/owner')
  @RequirePermissions(PermissionT.UPDATE_OWN_LECTURER_SELECTION_STATUS)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Lecturer] Update own lecturer selection status' })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID', type: String })
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
    @Body(new ZodValidationPipe(updateLecturerSelectionStatusDtoSchema))
    dto: UpdateLecturerSelectionStatusDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.updateStatusByOwner(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse('Cập nhật trạng thái đề tài thành công', result);
  }

  @Delete(':id')
  @RequirePermissions(PermissionT.DELETE_LECTURER_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Lecturer] Delete own lecturer selection' })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID', type: String })
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
    return generateApiResponse('Xóa đăng ký đề tài thành công', null);
  }

  @Delete(':id/admin')
  @RequirePermissions(PermissionT.DELETE_ANY_LECTURER_SELECTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Admin, Dean, TBM] Delete lecturer selection (Admin)',
  })
  @ApiParam({ name: 'id', description: 'Lecturer Selection ID', type: String })
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
  async deleteByAdmin(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.service.deleteByAdmin(id);
    return generateApiResponse('Xóa đăng ký đề tài thành công (Admin)', null);
  }
}
