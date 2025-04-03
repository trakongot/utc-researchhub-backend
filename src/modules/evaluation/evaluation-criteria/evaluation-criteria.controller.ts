import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  EvaluationCriteriaDto,
  EvaluationCriteriaQueryDto,
  EvaluationCriteriaQuerySchema,
  EvaluationCriteriaSchema,
} from './evaluation-criteria.dto';
import { EvaluationCriteriaService } from './evaluation-criteria.service';

@ApiTags('Evaluation Criteria')
@Controller('evaluation-criteria')
// @UseGuards(JwtAuthGuard)
export class EvaluationCriteriaController {
  constructor(
    private readonly evaluationCriteriaService: EvaluationCriteriaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo tiêu chí đánh giá' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo tiêu chí đánh giá thành công',
  })
  create(
    @Body(new ZodValidationPipe(EvaluationCriteriaSchema))
    dto: EvaluationCriteriaDto,
  ) {
    return this.evaluationCriteriaService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách tiêu chí đánh giá' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách tiêu chí đánh giá thành công',
  })
  findAll(
    @Query(new ZodValidationPipe(EvaluationCriteriaQuerySchema))
    query: EvaluationCriteriaQueryDto,
  ) {
    return this.evaluationCriteriaService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin tiêu chí đánh giá' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin tiêu chí đánh giá thành công',
  })
  findOne(@Param('id') id: string) {
    return this.evaluationCriteriaService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật tiêu chí đánh giá' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật tiêu chí đánh giá thành công',
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(EvaluationCriteriaSchema))
    dto: EvaluationCriteriaDto,
  ) {
    return this.evaluationCriteriaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa tiêu chí đánh giá' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa tiêu chí đánh giá thành công',
  })
  remove(@Param('id') id: string) {
    return this.evaluationCriteriaService.remove(id);
  }
}
