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
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateGraduationProjectAllocationsDto } from './dto/create.dto';
import { FindGraduationProjectAllocationsDto } from './dto/find.dto';
import { UpdateGraduationProjectAllocationsDto } from './dto/update.dto';
import { GraduationProjectAllocationsService } from './graduation-project-allocations.service';

@ApiTags('Graduation Project Allocations')
@Controller('graduation-project-allocations')
@ApiBearerAuth()
export class GraduationProjectAllocationsController {
  constructor(private readonly service: GraduationProjectAllocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Create a new graduation project allocation',
  })
  async create(@Body() dto: CreateGraduationProjectAllocationsDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'lecturerId', required: false })
  @ApiQuery({ name: 'topicTitle', required: false })
  @ApiQuery({ name: 'allocatedAtStart', required: false, type: Date })
  @ApiQuery({ name: 'allocatedAtEnd', required: false, type: Date })
  @ApiQuery({ name: 'createdAtStart', required: false, type: Date })
  @ApiQuery({ name: 'createdAtEnd', required: false, type: Date })
  @ApiQuery({ name: 'updatedAtStart', required: false, type: Date })
  @ApiQuery({ name: 'updatedAtEnd', required: false, type: Date })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async find(@Query() query: FindGraduationProjectAllocationsDto) {
    return this.service.find(
      query,
      Number(query.page) || 1,
      Number(query.limit) || 20,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Update a graduation project allocation',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGraduationProjectAllocationsDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Delete a graduation project allocation',
  })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
