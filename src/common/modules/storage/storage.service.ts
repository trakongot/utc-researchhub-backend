import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileT, UserT } from '@prisma/client';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

// Configuration for service
export interface StorageConfig {
  baseUploadDir: string;
  baseUrl: string;
  maxFileSizes: {
    avatar: number;
    document: number;
  };
  allowedMimeTypes: {
    avatar: string[];
    document: string[];
  };
}

export interface FileUploadResult {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  url: string;
}

export type StorageEntityType =
  | 'AVATAR'
  | 'PROJECT_REPORT'
  | 'PROPOSAL'
  | 'ATTACHMENT';

export interface FileUploadParams {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  };
  entityType: StorageEntityType;
  userId: string;
  userType: UserT;
  metadata?: Record<string, any>;
}

@Injectable()
export class StorageService {
  private readonly config: StorageConfig;
  private readonly directories: Record<StorageEntityType, string>;

  constructor(
    private readonly prisma: PrismaService,
    config?: Partial<StorageConfig>,
  ) {
    // Default config
    this.config = {
      baseUploadDir: config?.baseUploadDir || 'uploads',
      baseUrl: config?.baseUrl || 'http://localhost:4000',
      maxFileSizes: {
        avatar: config?.maxFileSizes?.avatar || 5 * 1024 * 1024, // 5MB
        document: config?.maxFileSizes?.document || 20 * 1024 * 1024, // 20MB
      },
      allowedMimeTypes: {
        avatar: config?.allowedMimeTypes?.avatar || ['image/jpeg', 'image/png'],
        document: config?.allowedMimeTypes?.document || [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      },
    };

    // Initialize directories
    this.directories = {
      AVATAR: path.join(this.config.baseUploadDir, 'avatars'),
      PROJECT_REPORT: path.join(this.config.baseUploadDir, 'project-reports'),
      PROPOSAL: path.join(this.config.baseUploadDir, 'proposals'),
      ATTACHMENT: path.join(this.config.baseUploadDir, 'attachments'),
    };

    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await Promise.all(
        Object.values(this.directories).map((dir) =>
          fs.mkdir(dir, { recursive: true }),
        ),
      );
    } catch (error) {
      throw new Error(`Failed to initialize directories: ${error.message}`);
    }
  }

  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const basename = path.basename(originalName, extension);
    return `${basename}-${timestamp}-${randomStr}${extension}`;
  }

  private validateFile(file, entityType: StorageEntityType): void {
    const isAvatar = entityType === 'AVATAR';
    const maxSize = isAvatar
      ? this.config.maxFileSizes.avatar
      : this.config.maxFileSizes.document;
    const allowedTypes = isAvatar
      ? this.config.allowedMimeTypes.avatar
      : this.config.allowedMimeTypes.document;

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`,
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }
  }

  private async logOperation(
    userId: string,
    userType: UserT,
    action: 'UPLOAD' | 'DELETE',
    entityType: StorageEntityType,
    filename: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        id: crypto.randomUUID(),
        entityType: 'FILE_UPLOAD',
        action,
        metadata: JSON.stringify({
          fileType: entityType,
          fileName: filename,
          ...metadata,
        }),
        userId,
        userType,
      },
    });
  }

  /**
   * Upload a file to the server
   * @param params File upload parameters
   * @returns Upload result with file information
   */
  async uploadFile(params: FileUploadParams): Promise<FileUploadResult> {
    try {
      // Log các thông tin đầu vào để debug
      console.log('uploadFile params:', {
        filename: params.file?.originalname,
        mimetype: params.file?.mimetype,
        size: params.file?.size,
        entityType: params.entityType,
        userId: params.userId,
        userType: params.userType,
      });

      const { file, entityType, userId, userType, metadata } = params;

      // Kiểm tra file có tồn tại không
      if (!file || !file.buffer) {
        console.error('File buffer is missing or empty');
        throw new BadRequestException('No file data received');
      }

      this.validateFile(file, entityType);

      // Kiểm tra thư mục upload có tồn tại không
      const uploadDir = this.directories[entityType];
      console.log('Upload directory:', uploadDir);

      try {
        await fs.access(uploadDir);
      } catch (error) {
        console.error(`Directory ${uploadDir} does not exist, creating...`);
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const filename = this.generateUniqueFilename(file.originalname);
      const filePath = path.join(uploadDir, filename);
      const fileUrl = `${this.config.baseUrl}/storage/${entityType.toLowerCase()}/${filename}`;

      console.log('Writing file to:', filePath);

      await fs.writeFile(filePath, file.buffer);
      console.log('File written successfully');

      //   await this.logOperation(
      //     userId,
      //     userType,
      //     'UPLOAD',
      //     entityType,
      //     filename,
      //     {
      //       originalName: file.originalname,
      //       size: file.size,
      //       ...metadata,
      //     },
      //   );

      return {
        filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        path: filePath,
        url: fileUrl,
      };
    } catch (error) {
      // Log lỗi chi tiết
      console.error('Upload error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });

      if (error instanceof BadRequestException) {
        throw error; // Trả về lỗi gốc nếu đã là BadRequestException
      }

      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Get a file from the server
   * @param filename Filename to retrieve
   * @param entityType Type of entity
   * @returns Stream and file information
   */
  async getFile(
    filename: string,
    entityType: StorageEntityType,
  ): Promise<{
    stream: NodeJS.ReadableStream;
    filename: string;
    path: string;
  }> {
    const filePath = path.join(this.directories[entityType], filename);

    try {
      await fs.access(filePath);
      return {
        stream: require('fs').createReadStream(filePath),
        filename,
        path: filePath,
      };
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  /**
   * Delete a file from the server
   * @param filename Filename to delete
   * @param entityType Type of entity
   * @param userId ID of the user performing the operation
   * @param userType Type of the user performing the operation
   */
  async deleteFile(
    filename: string,
    entityType: StorageEntityType,
    userId: string,
    userType: UserT,
  ): Promise<void> {
    const filePath = path.join(this.directories[entityType], filename);

    try {
      await fs.unlink(filePath);
      await this.logOperation(userId, userType, 'DELETE', entityType, filename);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  /**
   * Update faculty profile picture
   * @param facultyId ID of the faculty
   * @param pictureUrl URL of the profile picture
   */
  async updateFacultyProfilePicture(
    facultyId: string,
    pictureUrl: string,
  ): Promise<void> {
    try {
      await this.prisma.faculty.update({
        where: { id: facultyId },
        data: { profilePicture: pictureUrl },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update faculty profile picture: ${error.message}`,
      );
    }
  }

  /**
   * Update student profile picture
   * @param studentId ID of the student
   * @param pictureUrl URL of the profile picture
   */
  async updateStudentProfilePicture(
    studentId: string,
    pictureUrl: string,
  ): Promise<void> {
    try {
      await this.prisma.student.update({
        where: { id: studentId },
        data: { profilePicture: pictureUrl },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update student profile picture: ${error.message}`,
      );
    }
  }

  /**
   * Update proposal outline with file information
   * @param proposalOutlineId ID of the proposal outline
   * @param fileUrl URL of the file
   * @param fileSize Size of the file
   */
  async updateProposalOutline(
    proposalOutlineId: string,
    fileUrl: string,
    fileSize: number,
  ): Promise<void> {
    try {
      await this.prisma.proposalOutline.update({
        where: { id: proposalOutlineId },
        data: {
          fileUrl,
          fileSize,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update proposal outline: ${error.message}`,
      );
    }
  }

  /**
   * Create a project report file record
   * @param projectFinalReportId ID of the final report
   * @param fileType Type of file
   * @param fileUrl URL of the file
   * @param fileSize Size of the file
   * @param description Description of the file
   * @param uploadedById ID of the user who uploaded the file
   */
  async createProjectReportFile(
    projectFinalReportId: string,
    fileType: string,
    fileUrl: string,
    fileSize: number,
    description: string,
    uploadedById: string,
  ): Promise<void> {
    try {
      // Check if final report exists
      const finalReport = await this.prisma.projectFinalReport.findUnique({
        where: { id: projectFinalReportId },
      });

      if (!finalReport) {
        throw new NotFoundException('Final report not found');
      }

      // Create file record
      await this.prisma.projectReportFile.create({
        data: {
          id: crypto.randomUUID(),
          finalReportId: projectFinalReportId,
          fileType: fileType as FileT,
          fileUrl,
          fileSize,
          isArchived: false,
          description,
          uploadedById,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to create project report file: ${error.message}`,
      );
    }
  }
}
