import { z } from "zod";

// Password validation schema with custom rules
const password_schema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Email validation schema
const email_schema = z
  .string()
  .email("Invalid email format")
  .toLowerCase()
  .trim();

// Role enum validation
const role_schema = z.enum(["user", "admin"], {
  errorMap: () => ({ message: "Role must be either 'user' or 'admin'" }),
});

// Create user schema
export const create_user_schema = z.object({
  email: email_schema,
  password: password_schema,
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must not exceed 100 characters")
    .trim(),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must not exceed 100 characters")
    .trim(),
  role: role_schema.optional().default("user"),
});

// Update user schema (all fields optional)
export const update_user_schema = z.object({
  email: email_schema.optional(),
  password: password_schema.optional(),
  first_name: z
    .string()
    .min(1, "First name cannot be empty")
    .max(100, "First name must not exceed 100 characters")
    .trim()
    .optional(),
  last_name: z
    .string()
    .min(1, "Last name cannot be empty")
    .max(100, "Last name must not exceed 100 characters")
    .trim()
    .optional(),
  role: role_schema.optional(),
  is_active: z.boolean().optional(),
});

// Query parameters schema for pagination
export const user_query_schema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val))
    .pipe(z.number().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val))
    .pipe(
      z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100")
    ),
});

// UUID validation schema for params
export const uuid_param_schema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

// Type exports for TypeScript
export type create_user_input = z.infer<typeof create_user_schema>;
export type update_user_input = z.infer<typeof update_user_schema>;
export type user_query_params = z.infer<typeof user_query_schema>;
export type uuid_params = z.infer<typeof uuid_param_schema>;