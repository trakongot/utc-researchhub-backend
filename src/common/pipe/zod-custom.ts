import { errorMessages } from 'src/common/constant/errors';
import { z } from 'zod';

// String to Number
export const stringToNumber = (paramName: string) =>
  stringToType(
    paramName,
    (val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    },
    errorMessages.invalidNumber,
  );

// String to Boolean
export const stringToBoolean = (paramName: string) =>
  stringToType(
    paramName,
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    },
    errorMessages.invalidBoolean,
  );

// String to Date
export const stringToDate = (paramName: string) =>
  z
    .preprocess((val) => {
      if (typeof val === 'string') {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return val;
    }, z.date().optional())
    .refine((val) => val !== undefined, {
      message: `${paramName} ${errorMessages.invalidDate}`,
    });

// String to Object
export const stringToObject = (paramName: string) =>
  z
    .preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    }, z.object({}).optional())
    .refine((val) => val !== undefined, {
      message: `${paramName} ${errorMessages.invalidObject}`,
    });

// Helper function to add custom issue
const addCustomIssue = (ctx, paramName: string, errorMessage: string) =>
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: `${paramName} ${errorMessage}`,
  }) && z.NEVER;

// Generic function for string to any type transformation with error handling
const stringToType = (
  paramName: string,
  transformFn: (val: string) => any,
  errorMessage: string,
) =>
  z.string().transform((val, ctx) => {
    const result = transformFn(val);
    return result !== undefined
      ? result
      : addCustomIssue(ctx, paramName, errorMessage);
  });
