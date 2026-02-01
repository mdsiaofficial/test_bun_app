export interface api_response<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export const success_response = <T>(
  data: T,
  message?: string,
  status: number = 200
): Response => {
  const response_body: api_response<T> = {
    success: true,
    data,
  };

  if (message) {
    response_body.message = message;
  }

  return new Response(JSON.stringify(response_body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const error_response = (
  error: string,
  status: number = 400,
  errors?: Record<string, string[]>
): Response => {
  const response_body: api_response = {
    success: false,
    error,
  };

  if (errors) {
    response_body.errors = errors;
  }

  return new Response(JSON.stringify(response_body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const not_found_response = (message: string = "Resource not found"): Response => {
  return error_response(message, 404);
};

export const unauthorized_response = (message: string = "Unauthorized"): Response => {
  return error_response(message, 401);
};

export const forbidden_response = (message: string = "Forbidden"): Response => {
  return error_response(message, 403);
};

export const validation_error_response = (
  errors: Record<string, string[]>
): Response => {
  return error_response("Validation failed", 422, errors);
};