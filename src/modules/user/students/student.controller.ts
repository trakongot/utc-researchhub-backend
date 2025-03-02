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
import {
  CreateStudentDto,
  createStudentDtoSchema,
} from './dto/create-student.dto';
import {
  UpdateStudentDto,
  updateStudentDtoSchema,
} from './dto/update-student.dto';
import { StudentService } from './student.service';

@ApiTags('Students')
@Controller('/students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createStudentDtoSchema)) dto: CreateStudentDto,
    @Request() req: ReqWithRequester,
  ) {
    // Bạn có thể lấy thông tin requester từ req nếu cần thiết (vd: req.user.id)
    return await this.service.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    if (!result) throw new Error(`Không tìm thấy sinh viên với id: ${id}`);
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
    description: 'Số lượng bản ghi trên mỗi trang',
    example: '10',
  })
  async list(@Query('page') page: string, @Query('limit') limit: string) {
    return this.service.listStudents(Number(page) || 1, Number(limit) || 10);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentDtoSchema)) dto: UpdateStudentDto,
    @Request() req: ReqWithRequester,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Xóa sinh viên thành công' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
