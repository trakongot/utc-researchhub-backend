import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.errors.map((err) => ({
          field: err.path.length > 0 ? err.path.join('.') : 'unknown',
          message: err.message,
          ...(err.code === 'invalid_type' && {
            expected: err.expected,
            received: err.received,
          }),
        })),
      });
    }
    return result.data;
  }
}
