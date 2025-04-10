import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserT } from '@prisma/client';
import { Response } from 'express';
import { PermissionT } from 'src/common/constant/permissions';
import { generateApiResponse } from 'src/common/response';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequirePermissions } from 'src/modules/auth/permission.decorator';
import { PermissionGuard } from 'src/modules/auth/permission.guard';
import {
  FileUploadParams,
  StorageEntityType,
  StorageService,
} from './storage.service';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
  })
  async uploadAvatar(@UploadedFile() file: any, @Req() req: any) {
    try {
      // Kiểm tra file tồn tại
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      console.log('Request user:', req.user);

      // Kiểm tra user đã được xác thực
      if (!req.user || !req.user.id) {
        throw new BadRequestException('User not authenticated or missing ID');
      }

      const result = await this.storageService.uploadFile({
        file,
        entityType: 'AVATAR',
        userId: req.user.id,
        userType: req.user.userType,
      });

      if (req.user.userType === UserT.FACULTY) {
        await this.storageService.updateFacultyProfilePicture(
          req.user.id,
          result.url,
        );
      } else if (req.user.userType === UserT.STUDENT) {
        await this.storageService.updateStudentProfilePicture(
          req.user.id,
          result.url,
        );
      }

      return generateApiResponse('Upload ảnh đại diện thành công', result);
    } catch (error) {
      console.error('Avatar upload error:', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Post('proposal')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload proposal document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Proposal document to upload',
        },
        proposalOutlineId: {
          type: 'string',
          description: 'ID of the proposal outline',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Proposal document uploaded successfully',
  })
  async uploadProposal(
    @UploadedFile() file: any,
    @Req() req: any,
    @Body('proposalOutlineId') proposalOutlineId?: string,
  ) {
    const params: FileUploadParams = {
      file,
      entityType: 'PROPOSAL',
      userId: req.user.id,
      userType: req.user.userType,
      metadata: { proposalOutlineId },
    };

    const result = await this.storageService.uploadFile(params);

    // Update proposal outline if ID is provided
    if (proposalOutlineId) {
      await this.storageService.updateProposalOutline(
        proposalOutlineId,
        result.url,
        file.size,
      );
    }

    return {
      message: 'Proposal document uploaded successfully',
      data: result,
    };
  }

  @Post('project-report')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload project report' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Project report to upload',
        },
        fileType: {
          type: 'string',
          description: 'Type of file (PDF, WORD, etc.)',
        },
        description: {
          type: 'string',
          description: 'Description of the file',
        },
        projectFinalReportId: {
          type: 'string',
          description: 'ID of the final report',
        },
      },
      required: ['file', 'fileType'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Project report uploaded successfully',
  })
  async uploadProjectReport(
    @UploadedFile() file: any,
    @Req() req: any,
    @Body('fileType') fileType: string,
    @Body('description') description?: string,
    @Body('projectFinalReportId') projectFinalReportId?: string,
  ) {
    const params: FileUploadParams = {
      file,
      entityType: 'PROJECT_REPORT',
      userId: req.user.id,
      userType: req.user.userType,
      metadata: {
        fileType,
        description,
        projectFinalReportId,
      },
    };

    const result = await this.storageService.uploadFile(params);

    // Create project report file record if ID is provided
    if (projectFinalReportId) {
      await this.storageService.createProjectReportFile(
        projectFinalReportId,
        fileType,
        result.url,
        file.size,
        description || '',
        req.user.id,
      );
    }

    return {
      message: 'Project report uploaded successfully',
      data: result,
    };
  }

  @Get(':entityType/:filename')
  @ApiOperation({ summary: 'Download a file' })
  @ApiParam({
    name: 'entityType',
    enum: ['avatar', 'project-report', 'proposal', 'attachment'],
    description: 'Type of entity',
  })
  @ApiParam({
    name: 'filename',
    description: 'Filename to download',
  })
  @ApiResponse({
    status: 200,
    description: 'File stream sent',
  })
  async downloadFile(
    @Param('entityType') entityTypeParam: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Convert entity type parameter to StorageEntityType
    const entityType = this.convertToEntityType(entityTypeParam);

    // Get file
    const file = await this.storageService.getFile(filename, entityType);

    // Set content type based on filename
    this.setContentType(res, filename);

    // Set headers and pipe stream
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    file.stream.pipe(res);
  }

  @Delete(':entityType/:filename')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(PermissionT.MANAGE_FILES)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({
    name: 'entityType',
    enum: ['avatar', 'project-report', 'proposal', 'attachment'],
    description: 'Type of entity',
  })
  @ApiParam({
    name: 'filename',
    description: 'Filename to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  async deleteFile(
    @Param('entityType') entityTypeParam: string,
    @Param('filename') filename: string,
    @Req() req: any,
  ) {
    // Convert entity type parameter to StorageEntityType
    const entityType = this.convertToEntityType(entityTypeParam);

    // Delete file
    await this.storageService.deleteFile(
      filename,
      entityType,
      req.user.id,
      req.user.userType,
    );

    return {
      message: 'File deleted successfully',
    };
  }

  /**
   * Helper method to convert string entity type to StorageEntityType enum
   */
  private convertToEntityType(entityTypeParam: string): StorageEntityType {
    const mapping = {
      avatar: 'AVATAR',
      'project-report': 'PROJECT_REPORT',
      proposal: 'PROPOSAL',
      attachment: 'ATTACHMENT',
    };

    return (mapping[entityTypeParam] || 'ATTACHMENT') as StorageEntityType;
  }

  /**
   * Helper method to set content type header based on file extension
   */
  private setContentType(res: Response, filename: string): void {
    const extension = filename.split('.').pop()?.toLowerCase();

    const mimeTypes = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
    };

    res.setHeader(
      'Content-Type',
      (extension && mimeTypes[extension]) || 'application/octet-stream',
    );
  }
}
