export const validate_email = (email: string): boolean => {
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_regex.test(email);
};

export const validate_password = (password: string): {
  is_valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    is_valid: errors.length === 0,
    errors,
  };
};

export const validate_required_fields = (
  data: Record<string, any>,
  required_fields: string[]
): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  for (const field of required_fields) {
    if (!data[field] || (typeof data[field] === "string" && !data[field].trim())) {
      errors[field] = [`${field} is required`];
    }
  }

  return errors;
};