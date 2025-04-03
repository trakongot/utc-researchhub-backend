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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { ReqWithRequester } from 'src/common/interface';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ApiResponse } from 'src/common/responses';
import {
  ApproveAllocationDto,
  AutoProposeDto,
  CreateProposalOutlineDto,
  FindProposalOutlineDto,
  UpdateProposalOutlineDto,
} from './proposal-outline.module.dto';
import { ProposalOutlineService } from './proposal-outline.service';

@ApiTags('ProposalOutline')
@Controller('proposal-outline')
@ApiBearerAuth()
export class ProposalOutlineController {
  constructor(private readonly service: ProposalOutlineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new proposal outline' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        introduction: {
          type: 'string',
          example: 'Giới thiệu về đề tài nghiên cứu',
        },
        objectives: {
          type: 'string',
          example: 'Mục tiêu chính của nghiên cứu',
        },
        methodology: {
          type: 'string',
          example: 'Phương pháp thực hiện nghiên cứu',
        },
        expectedResults: {
          type: 'string',
          example: 'Kết quả dự kiến của nghiên cứu',
        },
        fileUrl: {
          type: 'string',
          example: 'https://example.com/files/proposal.pdf',
        },
        fileSize: {
          type: 'number',
          example: 1024000,
        },
        createdById: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        creatorType: {
          type: 'string',
          enum: ['STUDENT', 'FACULTY'],
          example: 'STUDENT',
        },
      },
      required: [
        'introduction',
        'objectives',
        'methodology',
        'expectedResults',
        'fileUrl',
        'createdById',
        'creatorType',
      ],
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    description: 'Proposal outline created successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body(new ZodValidationPipe(CreateProposalOutlineDto))
    dto: CreateProposalOutlineDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.create(dto);
    return {
      success: true,
      message: 'Nộp đề cương thành công',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a proposal outline by ID' })
  @ApiParam({ name: 'id', description: 'Proposal Outline ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Proposal outline found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Proposal outline not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async get(@Param('id') id: string): Promise<ApiResponse<any>> {
    const result = await this.service.get(id);
    return {
      success: true,
      message: 'Lấy thông tin đề cương thành công',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find proposal outlines with filtering options' })
  @ApiQuery({ name: 'createdById', required: false, description: 'Creator ID' })
  @ApiQuery({
    name: 'creatorType',
    required: false,
    enum: ['STUDENT', 'FACULTY'],
    description: 'Creator type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED'],
    description: 'Approval status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['createdAt', 'updatedAt'],
    description: 'Field to order by',
  })
  @ApiQuery({
    name: 'asc',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'List of proposal outlines',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameter format',
  })
  async find(
    @Query(new ZodValidationPipe(FindProposalOutlineDto))
    query: FindProposalOutlineDto,
  ) {
    return this.service.find(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a proposal outline' })
  @ApiParam({ name: 'id', description: 'Proposal Outline ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        introduction: {
          type: 'string',
          example: 'Giới thiệu cập nhật về đề tài nghiên cứu',
        },
        objectives: {
          type: 'string',
          example: 'Mục tiêu chính cập nhật của nghiên cứu',
        },
        methodology: {
          type: 'string',
          example: 'Phương pháp thực hiện nghiên cứu đã cập nhật',
        },
        expectedResults: {
          type: 'string',
          example: 'Kết quả dự kiến cập nhật của nghiên cứu',
        },
        fileUrl: {
          type: 'string',
          example: 'https://example.com/files/proposal-updated.pdf',
        },
        fileSize: {
          type: 'number',
          example: 1048576,
        },
        status: {
          type: 'string',
          enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED'],
          example: 'PENDING_REVIEW',
        },
      },
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Proposal outline updated successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Proposal outline not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or ID format',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProposalOutlineDto))
    dto: UpdateProposalOutlineDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.update(id, dto);
    return {
      success: true,
      message: 'Cập nhật đề cương thành công',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a proposal outline' })
  @ApiParam({ name: 'id', description: 'Proposal Outline ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Proposal outline deleted successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Proposal outline not found',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  async delete(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.service.delete(id);
    return {
      success: true,
      message: 'Xóa đề cương thành công',
      data: null,
    };
  }

  @Post('auto-propose')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Automatically propose and allocate projects',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        departmentId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
    description: 'Department information for auto proposal',
  })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    description: 'Auto proposal successful',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async autoPropose(
    @Body(new ZodValidationPipe(AutoProposeDto)) dto: AutoProposeDto,
    @Request() req: ReqWithRequester,
  ) {
    const result = await this.service.autoPropose(dto, '1');
    return {
      success: true,
      message: 'Tự động đề xuất và phân công thành công, chờ duyệt',
      data: result,
    };
  }

  @Post('approve-allocation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve or reject project allocation',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        status: {
          type: 'string',
          enum: [
            'APPROVED_BY_HEAD',
            'REJECTED_BY_HEAD',
            'REQUESTED_CHANGES_HEAD',
          ],
          example: 'APPROVED_BY_HEAD',
        },
      },
      required: ['projectId', 'status'],
    },
    description: 'Approval information for project allocation',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Allocation approval successful',
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async approveAllocation(
    @Body(new ZodValidationPipe(ApproveAllocationDto))
    dto: ApproveAllocationDto,
    @Request() req: ReqWithRequester,
  ): Promise<ApiResponse<any>> {
    const result = await this.service.approveAllocation(dto, '1');
    return {
      success: true,
      message: 'Duyệt phân công thành công',
      data: result,
    };
  }
}
