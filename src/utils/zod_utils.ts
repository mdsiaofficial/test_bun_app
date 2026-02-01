import { ZodError, ZodSchema } from "zod";

/**
 * Format Zod validation errors into a structured error object
 */
export const format_zod_errors = (error: ZodError): Record<string, string[]> => {
  const formatted_errors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const field = err.path.join(".");
    if (!formatted_errors[field]) {
      formatted_errors[field] = [];
    }
    formatted_errors[field].push(err.message);
  });

  return formatted_errors;
};

/**
 * Validate data against a Zod schema
 */
export const validate_schema = <T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } => {
  try {
    const validated_data = schema.parse(data);
    return { success: true, data: validated_data };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: format_zod_errors(error) };
    }
    throw error;
  }
};

/**
 * Async version of validate_schema
 */
export const validate_schema_async = async <T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string[]> }> => {
  try {
    const validated_data = await schema.parseAsync(data);
    return { success: true, data: validated_data };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: format_zod_errors(error) };
    }
    throw error;
  }
};