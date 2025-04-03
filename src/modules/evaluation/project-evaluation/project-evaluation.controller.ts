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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {
  ProjectEvaluationDto,
  ProjectEvaluationQueryDto,
  ProjectEvaluationQuerySchema,
  ProjectEvaluationSchema,
  ProjectEvaluationScoreDto,
  ProjectEvaluationScoreSchema,
} from './project-evaluation.dto';
import { ProjectEvaluationService } from './project-evaluation.service';

@ApiTags('Project Evaluation')
@Controller('project-evaluation')
export class ProjectEvaluationController {
  constructor(
    private readonly projectEvaluationService: ProjectEvaluationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đánh giá dự án' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo đánh giá dự án thành công',
  })
  create(
    @Body(new ZodValidationPipe(ProjectEvaluationSchema))
    dto: ProjectEvaluationDto,
  ) {
    return this.projectEvaluationService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách đánh giá dự án' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách đánh giá dự án thành công',
  })
  findAll(
    @Query(new ZodValidationPipe(ProjectEvaluationQuerySchema))
    query: ProjectEvaluationQueryDto,
  ) {
    return this.projectEvaluationService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin đánh giá dự án' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin đánh giá dự án thành công',
  })
  findOne(@Param('id') id: string) {
    return this.projectEvaluationService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật đánh giá dự án' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật đánh giá dự án thành công',
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ProjectEvaluationSchema))
    dto: ProjectEvaluationDto,
  ) {
    return this.projectEvaluationService.update(id, dto);
  }

  @Post(':id/score')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm điểm đánh giá' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm điểm đánh giá thành công',
  })
  addScore(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ProjectEvaluationScoreSchema))
    dto: ProjectEvaluationScoreDto,
  ) {
    return this.projectEvaluationService.addScore(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa đánh giá dự án' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa đánh giá dự án thành công',
  })
  remove(@Param('id') id: string) {
    return this.projectEvaluationService.remove(id);
  }
}
