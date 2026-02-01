import { error_response } from "../utils/response_utils";

export const error_handler = async (
  error: Error,
  request: Request
): Promise<Response> => {
  console.error("Error:", error);

  if (error.message.includes("already exists")) {
    return error_response(error.message, 409);
  }

  if (error.message.includes("not found")) {
    return error_response(error.message, 404);
  }

  if (error.message.includes("Unauthorized") || error.message.includes("Invalid")) {
    return error_response(error.message, 401);
  }

  return error_response(
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message,
    500
  );
};