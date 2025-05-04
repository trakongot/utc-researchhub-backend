import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { ReqWithRequester } from 'src/common/interface';
import { generateApiResponse } from 'src/common/response';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProposedProjectService } from './proposed-project.service';
import {
  AdvisorReviewDto,
  CreateProposedProjectTriggerDto,
  DepartmentHeadReviewDto,
  FindProposedProjectDto,
  HeadApprovalDto,
  LockProposalOutlineDto,
  ManageProposedMemberDto,
  ReviewProposalOutlineDto,
  SubmitProposalOutlineDto,
  UpdateProposedProjectDto,
  UpdateProposedProjectTitleDto,
  UpdateStatusDto,
  advisorReviewSchema,
  createProposedProjectTriggerSchema,
  departmentHeadReviewSchema,
  findProposedProjectSchema,
  headApprovalSchema,
  lockProposalOutlineSchema,
  manageProposedMemberSchema,
  reviewProposalOutlineSchema,
  submitProposalOutlineSchema,
  updateProposedProjectSchema,
  updateProposedProjectTitleSchema,
  updateStatusSchema,
} from './schema';

@ApiTags('Proposed Projects')
@Controller('proposed-projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProposedProjectController {
  constructor(
    private readonly proposedProjectService: ProposedProjectService,
  ) {}

  // PHASE 1: Initialize proposal from ProjectAllocation
  @Post('trigger')
  @ApiOperation({
    summary: 'Initialize project proposal from allocation record',
  })
  @ApiResponse({
    status: 201,
    description: 'Project proposal successfully created',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Allocation record not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to create project proposal',
  })
  async createFromAllocation(
    @Body(new ZodValidationPipe(createProposedProjectTriggerSchema))
    dto: CreateProposedProjectTriggerDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Project proposal initialized successfully',
      await this.proposedProjectService.createFromAllocation(
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 2: Student updates project title
  @Put(':id')
  @ApiOperation({ summary: 'Update project proposal information' })
  @ApiResponse({
    status: 200,
    description: 'Project proposal updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to update project proposal',
  })
  async updateProposedProject(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProposedProjectSchema))
    dto: UpdateProposedProjectDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Project proposal updated successfully',
      await this.proposedProjectService.updateProposedProject(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 3: Advisor reviews project title
  @Put(':id/advisor-review')
  @ApiOperation({ summary: 'Advisor reviews project title' })
  @ApiResponse({
    status: 200,
    description: 'Project proposal reviewed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to review project proposal',
  })
  async advisorReview(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(advisorReviewSchema))
    dto: AdvisorReviewDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Project proposal reviewed successfully',
      await this.proposedProjectService.advisorReview(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 4: Department head reviews project
  @Put(':id/head-review')
  @ApiOperation({ summary: 'Department head reviews project proposal' })
  @ApiResponse({
    status: 200,
    description: 'Project proposal reviewed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to review project proposal',
  })
  async departmentHeadReview(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(departmentHeadReviewSchema))
    dto: DepartmentHeadReviewDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Project proposal reviewed successfully',
      await this.proposedProjectService.departmentHeadReview(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 5: Faculty head approves and creates official project
  @Put(':id/final-approval')
  @ApiOperation({
    summary: 'Faculty head gives final approval and creates official project',
  })
  @ApiResponse({
    status: 200,
    description:
      'Project proposal approved and official project created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission for final approval of project proposal',
  })
  async headApproval(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(headApprovalSchema))
    dto: HeadApprovalDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Final approval complete and official project created successfully',
      await this.proposedProjectService.headApproval(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // New endpoint for bulk approval of all pending proposals
  @Post('bulk-approve')
  @ApiOperation({
    summary:
      'Faculty head approves all pending proposals in their department at once',
  })
  @ApiResponse({
    status: 200,
    description: 'All pending proposals processed successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'No permission to perform bulk approval',
  })
  async bulkApproveProposals(@Request() request: ReqWithRequester) {
    return generateApiResponse(
      'Bulk approval of proposals completed',
      await this.proposedProjectService.approvePendingProposalsInDepartment(
        request.requester,
      ),
    );
  }

  // Member management in project proposal
  @Put(':id/members')
  @ApiOperation({ summary: 'Manage members in project proposal' })
  @ApiResponse({
    status: 200,
    description: 'Members updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to manage project proposal members',
  })
  async manageMembers(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(manageProposedMemberSchema))
    dto: ManageProposedMemberDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Members updated successfully',
      await this.proposedProjectService.manageMembers(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 6: Student submits detailed proposal outline
  @Post('outline')
  @ApiOperation({ summary: 'Student submits detailed proposal outline' })
  @ApiResponse({
    status: 201,
    description: 'Proposal outline submitted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to submit proposal outline',
  })
  async submitProposalOutline(
    @Body(new ZodValidationPipe(submitProposalOutlineSchema))
    dto: SubmitProposalOutlineDto,
    @Request() request: ReqWithRequester,
  ) {
    // Student should upload file first through storage API and get fileId
    // Then call this API to submit the outline with fileId
    return generateApiResponse(
      'Proposal outline submitted successfully',
      await this.proposedProjectService.submitProposalOutline(
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 7: Advisor/Department Head reviews proposal outline
  @Put('outline/:id/review')
  @ApiOperation({ summary: 'Advisor/Department Head reviews proposal outline' })
  @ApiResponse({
    status: 200,
    description: 'Proposal outline reviewed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Proposal outline not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to review proposal outline',
  })
  async reviewProposalOutline(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(reviewProposalOutlineSchema))
    dto: ReviewProposalOutlineDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Proposal outline reviewed successfully',
      await this.proposedProjectService.reviewProposalOutline(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // PHASE 8: Faculty Head locks proposal outline
  @Put('outline/:id/lock')
  @ApiOperation({ summary: 'Faculty Head locks proposal outline' })
  @ApiResponse({
    status: 200,
    description: 'Proposal outline locked successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Proposal outline not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to lock proposal outline',
  })
  async lockProposalOutline(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(lockProposalOutlineSchema))
    dto: LockProposalOutlineDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Proposal outline locked successfully',
      await this.proposedProjectService.lockProposalOutline(
        id,
        dto,
        request.requester,
      ),
    );
  }

  // Search for project proposals
  @Get()
  @ApiOperation({ summary: 'Search for project proposals' })
  @ApiResponse({ status: 200, description: 'List of project proposals' })
  async find(
    @Query(new ZodValidationPipe(findProposedProjectSchema))
    dto: FindProposedProjectDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Project proposals retrieved successfully',
      await this.proposedProjectService.find(dto, request.requester),
    );
  }

  // Get details of a project proposal
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a project proposal' })
  @ApiResponse({ status: 200, description: 'Project proposal details' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to view project proposal details',
  })
  async findOne(@Param('id') id: string, @Request() request: ReqWithRequester) {
    return generateApiResponse(
      'Project proposal details retrieved successfully',
      await this.proposedProjectService.findOne(id, request.requester),
    );
  }

  // General API to update project proposal status
  @Put(':id/status')
  @ApiOperation({ summary: 'Update project proposal status' })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Project proposal not found' })
  @ApiResponse({
    status: 403,
    description: 'No permission to change status',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) dto: UpdateStatusDto,
    @Request() request: ReqWithRequester,
  ) {
    return generateApiResponse(
      'Status updated successfully',
      await this.proposedProjectService.updateStatus(
        id,
        dto,
        request.requester,
      ),
    );
  }

  @Put(':id/title')
  @ApiOperation({
    summary: 'Update proposed project title',
    description:
      'Update the title of a proposed project with appropriate status validation',
  })
  @ApiParam({
    name: 'id',
    description: 'Proposed project ID',
    required: true,
  })
  @ApiBody({ type: UpdateProposedProjectTitleDto })
  @ApiResponse({
    status: 200,
    description: 'Proposed project title updated successfully',
  })
  async updateProposedProjectTitle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProposedProjectTitleSchema))
    updateProposedProjectTitleDto: UpdateProposedProjectTitleDto,
    @Request() request: ReqWithRequester,
  ) {
    // Only allow students to update their proposal title
    const result = await this.proposedProjectService.updateProposedProjectTitle(
      id,
      updateProposedProjectTitleDto,
      request.requester,
    );
    return generateApiResponse(
      'Proposed project title updated successfully',
      result,
    );
  }
}
