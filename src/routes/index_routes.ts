import { user_routes } from "./user_routes";
import { not_found_response } from "../utils/response_utils";

export const handle_routes = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Health check endpoint
  if (path === "/health" || path === "/") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // User routes
  const user_response = await user_routes(request, path);
  if (user_response) {
    return user_response;
  }

  // 404 Not Found
  return not_found_response("Route not found");
};