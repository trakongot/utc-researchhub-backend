import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express'; 
import { ApiResponseError } from 'src/common/responses';
import { generateApiResponse } from '../responses';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.';
    let error = 'Internal Server Error';
    let validationErrors: Record<string, string[]> | undefined = undefined;

    // Handle BadRequestException with validation errors
    if (exception?.name === 'BadRequestException') {
      const errorResponse = exception.getResponse() as {
        message: string | string[];
        error: string;
        statusCode: number;
        errors?: Record<string, string[]>;
      };

      if (typeof errorResponse === 'object' && errorResponse.errors) {
        status = HttpStatus.BAD_REQUEST;
        message =
          typeof errorResponse.message === 'string'
            ? errorResponse.message
            : 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường.';
        error = exception.name;
        validationErrors = errorResponse.errors;
      }
    }

    // Handle 404 error - Resource not found
    else if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.NOT_FOUND
    ) {
      status = HttpStatus.NOT_FOUND;
      message = 'Tài nguyên không tìm thấy';
      error = 'Not Found';
    }

    // Handle other HttpException errors
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object') {
        if ('message' in errorResponse) {
          message = errorResponse.message as string;
        }
        if ('error' in errorResponse) {
          error = errorResponse.error as string;
        }
      }
    }

    // Handle Prisma errors
    else if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';
      message = 'Lỗi cơ sở dữ liệu. Vui lòng thử lại sau.';
    } else {
      this.logger.error(`${request.method} ${request.url}`, exception.stack);
    }

    const apiError: ApiResponseError = {
      code: error,
      message,
      details: validationErrors,
    };

    // Use generateApiResponse to return structured response
    const responseBody = generateApiResponse(
      message,
      null,
      undefined,
      apiError,
    );

    response.status(status).json(responseBody);
  }
}
