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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReqWithRequester } from 'src/share';
import { ZodValidationPipe } from 'src/share/zod-validation.pipe';
import { LecturerService } from './lecturer.service';
import {
  CreateLecturerDto,
  createLecturerDtoSchema,
} from './dto/create-lecturer.dto';
import {
  UpdateLecturerDto,
  updateLecturerDtoSchema,
} from './dto/update-lecturer.dto';

@ApiTags('Lecturers')
@Controller('/lecturers')
@ApiBearerAuth()
export class LecturerController {
  constructor(private readonly service: LecturerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createLecturerDtoSchema))
    dto: CreateLecturerDto,
    @Request() req: ReqWithRequester,
  ) {
    // Bạn có thể lấy thông tin requester nếu cần từ req (vd: req.user.id)
    return await this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    if (!result) throw new Error(`Không tìm thấy giảng viên với id: ${id}`);
    return result;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số bản ghi trên mỗi trang',
    example: '10',
  })
  async list(@Query('page') page: string, @Query('limit') limit: string) {
    return this.service.listLecturers(Number(page) || 1, Number(limit) || 10);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLecturerDtoSchema))
    dto: UpdateLecturerDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Xóa giảng viên thành công' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
