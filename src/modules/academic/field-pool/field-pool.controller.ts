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
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { ReqWithRequester } from 'src/share';
import {
  createFieldPoolDto,
  createFieldPoolSchema,
  updateFieldPoolDto,
} from './dto';
import { FieldPoolService } from './field-pool.service';

@ApiTags('FieldPool')
@Controller('field-pool')
@ApiBearerAuth()
export class FieldPoolController {
  constructor(private readonly service: FieldPoolService) {}

  // 🟢 FieldPool APIs
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Field 1',
        },
        description: { type: 'string', nullable: true },
        registrationDeadline: {
          type: 'string',
          example: '2025-12-31',
          nullable: true,
        },
      },
    },
  })
  async create(
    @Body(new ZodValidationPipe(createFieldPoolSchema))
    dto: createFieldPoolDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.create(dto);
    return {
      data: result,
      message: 'Tạo thành công',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'ID của field pool' })
  async get(@Param('id') id: string) {
    const result = await this.service.get(id);
    return {
      data: result,
      message: 'Lấy field pool thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async find() {
    const result = await this.service.find();
    return {
      data: result,
      message: 'Lấy danh sách field pool thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'ID của field pool' })
  async update(@Param('id') id: string, @Body() dto: updateFieldPoolDto) {
    const result = await this.service.update(id, dto);
    return {
      data: result,
      message: 'Cập nhật field pool thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa FieldPool' })
  @ApiParam({ name: 'id', description: 'ID của field pool' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
