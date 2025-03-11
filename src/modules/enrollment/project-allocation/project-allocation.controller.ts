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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProjectAllocationDto } from './dto/create.dto';
import { FindProjectAllocationDto } from './dto/find.dto';
import { UpdateProjectAllocationDto } from './dto/update.dto';
import { ProjectAllocationService } from './project-allocation.service';

@ApiTags(' Project Allocation')
@Controller('-project-Allocation')
@ApiBearerAuth()
export class ProjectAllocationController {
  constructor(private readonly service: ProjectAllocationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProjectAllocationDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async find(
    @Query() query: FindProjectAllocationDto,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;

    return this.service.find(query, pageNumber, limitNumber);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectAllocationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
