import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  ApiResponse as CustomApiResponse,
  generateApiResponse,
} from 'src/common/response';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/modules/auth/permission.guard';

import { ReqWithRequester } from 'src/common/interface';

import { CriteriaService } from './criteria.service';
import { EvaluationCriteriaDto, CreateEvaluationCriteriaDto, UpdateEvaluationCriteriaDto } from './schema';

@ApiTags('Evaluation - Criteria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@UsePipes(ZodValidationPipe)
@Controller('evaluation/criteria')
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tiêu chí đánh giá mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo tiêu chí thành công.',
    type: EvaluationCriteriaDto,
  })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  async create(
    @Body() createCriteriaDto: CreateEvaluationCriteriaDto,
    @Req() req: ReqWithRequester,
  ) {
    const criteria = await this.criteriaService.create(
      createCriteriaDto,
      req.requester,
    );
    return generateApiResponse('Tạo tiêu chí thành công', criteria);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả tiêu chí đánh giá' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công.',
    type: [EvaluationCriteriaDto],
  })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  async findAll() {
    const criteriaList = await this.criteriaService.findAll();
    return generateApiResponse(
      'Lấy danh sách tiêu chí thành công',
      criteriaList,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một tiêu chí' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công.',
    type: EvaluationCriteriaDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tiêu chí.' })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const criteria = await this.criteriaService.findOne(id);
    return generateApiResponse('Lấy thông tin tiêu chí thành công', criteria);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tiêu chí đánh giá' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công.',
    type: EvaluationCriteriaDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tiêu chí.' })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCriteriaDto: UpdateEvaluationCriteriaDto,
  ) {
    const updatedCriteria = await this.criteriaService.update(
      id,
      updateCriteriaDto,
    );
    return generateApiResponse('Cập nhật tiêu chí thành công', updatedCriteria);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tiêu chí đánh giá' })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tiêu chí.' })
  @ApiResponse({ status: 400, description: 'Tiêu chí đang được sử dụng.' })
  @ApiResponse({ status: 403, description: 'Không có quyền.' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CustomApiResponse<null>> {
    await this.criteriaService.remove(id);
    return generateApiResponse('Xóa tiêu chí thành công', null);
  }
}
