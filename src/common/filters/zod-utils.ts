import { errorMessages } from 'src/common/filters/errors-constants';
import { z } from 'zod';

// Helper function for custom error handling
const addCustomIssue = (ctx, paramName: string, errorMessage: string) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: `${paramName} ${errorMessage}`,
  });
  return z.NEVER;
};

// String to Number
export const stringToNumber = (paramName: string) =>
  z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed)
      ? addCustomIssue(ctx, paramName, errorMessages.invalidNumber)
      : parsed;
  });

// String to Boolean
export const stringToBoolean = (paramName: string) =>
  z.string().transform((val, ctx) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return addCustomIssue(ctx, paramName, errorMessages.invalidBoolean);
  });

// String to Date
export const stringToDate = (paramName: string) =>
  z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return val;
    },
    z
      .date({
        errorMap: () => ({
          message: `${paramName} ${errorMessages.invalidDate}`,
        }),
      })
      .optional(),
  );

// String to Object
export const stringToObject = (paramName: string) =>
  z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return {};
        }
      }
      return val;
    },
    z
      .object({})
      .optional()
      .refine((val) => val !== undefined, {
        message: `${paramName} ${errorMessages.invalidObject}`,
      }),
  );

import { ZodType } from 'zod';

const zodTypeMap = {
  ZodString: { type: 'string', decorator: '@ApiProperty({ type: String })' },
  ZodNumber: { type: 'number', decorator: '@ApiProperty({ type: Number })' },
  ZodBoolean: { type: 'boolean', decorator: '@ApiProperty({ type: Boolean })' },
  ZodDate: {
    type: 'Date',
    decorator: '@ApiProperty({ type: String, format: "date-time" })',
  },
  ZodDateString: {
    type: 'string',
    decorator: '@ApiProperty({ type: String, format: "date" })',
  },
};

export const zodToClass = (zodSchema: z.ZodObject<any, any>) => {
  const shape = zodSchema._def.shape();
  const className = `GeneratedClass`;
  const classProperties: string[] = [];

  Object.entries(shape).forEach(([key, field]) => {
    let decorator = '@ApiProperty()';
    let fieldType = 'any';

    if (field instanceof z.ZodString) {
      decorator = zodTypeMap.ZodString.decorator;
      fieldType = zodTypeMap.ZodString.type;
    } else if (field instanceof z.ZodNumber) {
      decorator = zodTypeMap.ZodNumber.decorator;
      fieldType = zodTypeMap.ZodNumber.type;
    } else if (field instanceof z.ZodBoolean) {
      decorator = zodTypeMap.ZodBoolean.decorator;
      fieldType = zodTypeMap.ZodBoolean.type;
    } else if (field instanceof z.ZodDate) {
      decorator = zodTypeMap.ZodDate.decorator;
      fieldType = zodTypeMap.ZodDate.type;
    } else if (field instanceof z.ZodArray) {
      const arrayType = field._def.type;
      decorator = `@ApiProperty({ type: [${getFieldType(arrayType)}] })`;
      fieldType = `Array<${getFieldType(arrayType)}>`;
    } else if (field instanceof z.ZodObject) {
      const nestedClass = zodToClass(field);
      decorator = `@ApiProperty({ type: ${nestedClass.className} })`;
      fieldType = nestedClass.className;
    }

    if (field instanceof z.ZodOptional || field instanceof z.ZodNullable) {
      decorator = '@ApiProperty({ required: false })';
    }

    classProperties.push(`${decorator}\n  ${key}: ${fieldType};`);
  });

  return {
    className,
    classString: `class ${className} {\n${classProperties.join('\n')}\n}`,
  };
};

function getFieldType(field: ZodType<any, any>): string {
  if (field instanceof z.ZodString) return 'string';
  if (field instanceof z.ZodNumber) return 'number';
  if (field instanceof z.ZodBoolean) return 'boolean';
  if (field instanceof z.ZodArray) return 'Array<any>';
  if (field instanceof z.ZodObject) return 'object';
  if (field instanceof z.ZodDate) return 'Date';
  return 'any';
}
