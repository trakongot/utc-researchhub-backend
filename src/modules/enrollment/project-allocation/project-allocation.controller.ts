import {
  BadRequestException,
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
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';

import { ReqWithRequester } from 'src/common/interface';
import { ZodValidationPipe } from 'src/common/pipe/zod-validation.pipe';
import { ApiResponse, generateApiResponse } from 'src/common/response';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/modules/auth/permission.guard';
import { ProjectAllocationService } from './project-allocation.service';
import {
  CreateProjectAllocationDto,
  FindProjectAllocationDto,
  RecommendationExportDto,
  UpdateProjectAllocationDto,
  createProjectAllocationDtoSchema,
  findProjectAllocationDtoSchema,
  recommendationExportDtoSchema,
  updateProjectAllocationDtoSchema,
} from './schema';

@ApiTags('Project Allocation')
@Controller('project-allocations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProjectAllocationController {
  constructor(private readonly service: ProjectAllocationService) {}

  @Post()
  // @RequirePermissions(PermissionT.CREATE_PROJECT_ALLOCATION)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[TBM, Dean] Create a new project allocation' })
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
    @Body(new ZodValidationPipe(createProjectAllocationDtoSchema))
    dto: CreateProjectAllocationDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.create(dto, req.requester.id);
    return generateApiResponse('Phân công đề tài thành công', result);
  }

  @Get()
  // @RequirePermissions(PermissionT.VIEW_PROJECT_ALLOCATION_LIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[All Roles] Find project allocations (filtered by role)',
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
    @Query(new ZodValidationPipe(findProjectAllocationDtoSchema))
    query: FindProjectAllocationDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.find(query, req.requester);
    return generateApiResponse(
      'Lấy danh sách phân công đề tài thành công',
      result,
    );
  }

  @Get('student/:studentId')
  // @RequirePermissions(PermissionT.VIEW_PROJECT_ALLOCATION_DETAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[TBM, Dean, Lecturer] Get allocations by student ID',
  })
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async findByStudent(
    @Param('studentId') studentId: string,
  ): Promise<ApiResponse<any>> {
    const allocations = await this.service.findByStudent(studentId);
    return generateApiResponse(
      'Lấy danh sách phân công đề tài của sinh viên thành công',
      allocations,
    );
  }

  @Get('lecturer/:lecturerId')
  // @RequirePermissions(PermissionT.VIEW_PROJECT_ALLOCATION_DETAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[TBM, Dean, Lecturer] Get allocations by lecturer ID',
  })
  @ApiParam({ name: 'lecturerId', description: 'Lecturer ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async findByLecturer(
    @Param('lecturerId') lecturerId: string,
  ): Promise<ApiResponse<any>> {
    const allocations = await this.service.findByLecturer(lecturerId);
    return generateApiResponse(
      'Lấy danh sách phân công đề tài của giảng viên thành công',
      allocations,
    );
  }

  @Get('recommendations')
  // @RequirePermissions(PermissionT.VIEW_PROJECT_ALLOCATION_RECOMMENDATION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[TBM, Dean] Get recommended allocations as Excel or JSON',
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
  async getRecommendations(
    @Query(new ZodValidationPipe(recommendationExportDtoSchema))
    query: RecommendationExportDto,
    @Response() res: ExpressResponse,
  ): Promise<any> {
    const result = await this.service.getRecommendations(query);

    if (query.format === 'json') {
      return res.json(
        generateApiResponse('Lấy đề xuất phân công đề tài thành công', result),
      );
    } else {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${result.fileName}`,
      );
      res.send(result.buffer);
    }
  }

  @Get(':id')
  // @RequirePermissions(PermissionT.VIEW_PROJECT_ALLOCATION_DETAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[All Roles] Get a project allocation by ID',
  })
  @ApiParam({ name: 'id', description: 'Project Allocation ID', type: String })
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
    const data = await this.service.findById(id);
    return generateApiResponse(
      'Lấy thông tin phân công đề tài thành công',
      data,
    );
  }

  @Patch(':id')
  // @RequirePermissions(PermissionT.UPDATE_PROJECT_ALLOCATION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[TBM, Dean] Update a project allocation' })
  @ApiParam({ name: 'id', description: 'Project Allocation ID', type: String })
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
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProjectAllocationDtoSchema))
    dto: UpdateProjectAllocationDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const updatedAllocation = await this.service.update(
      id,
      dto,
      req.requester.id,
    );
    return generateApiResponse(
      'Cập nhật phân công đề tài thành công',
      updatedAllocation,
    );
  }

  @Delete(':id')
  // @RequirePermissions(PermissionT.DELETE_PROJECT_ALLOCATION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[TBM, Dean] Delete a project allocation' })
  @ApiParam({ name: 'id', description: 'Project Allocation ID', type: String })
  @SwaggerApiResponse({ status: HttpStatus.OK, description: 'Deleted' })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  async delete(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.service.delete(id);
    return generateApiResponse('Xóa phân công đề tài thành công', null);
  }

  @Post('upload')
  // @RequirePermissions(PermissionT.CREATE_PROJECT_ALLOCATION)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '[TBM, Dean] Import project allocations from Excel',
    description:
      'Nhập phân công đề tài từ file Excel. Sử dụng tham số ?skipExisting=true để bỏ qua sinh viên đã có phân công thay vì báo lỗi. Sử dụng ?skipDepartmentCheck=true để bỏ qua kiểm tra khoa.',
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
  @ApiBody({
    description: 'Excel file containing project allocations',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('skipExisting') skipExisting: string = 'false',
    @Query('skipDepartmentCheck') skipDepartmentCheck: string = 'false',
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    if (!file) {
      throw new BadRequestException('File không được cung cấp');
    }

    const allocations = await this.service.parseExcelAllocations(file.buffer);
    const result = await this.service.bulkCreate(
      allocations,
      req.requester.id,
      skipDepartmentCheck === 'true' ? undefined : req.requester.departmentId,
      skipExisting === 'true',
    );

    return generateApiResponse('Nhập phân công từ file thành công', result);
  }
}
