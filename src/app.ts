
import { add_cors_headers, cors_middleware } from "./middlewares/cors";
import { error_handler } from "./middlewares/error_handler";
import { logger_middleware } from "./middlewares/logger";
import { handle_routes } from "./routes/index_routes";

export const create_app = () => {
  // ! ei create app ki kortese? 
  // ? ei create app actually ekta async function return kortase, 
  // ? jeita receive kore request, and return kore response er promise.
  return {
    async fetch(request: Request): Promise<Response> {
      try {
        // Logger middleware
        logger_middleware(request);

        // CORS preflight
        const cors_response = cors_middleware(request);
        if (cors_response) {
          return cors_response;
        }

        // Handle routes
        const response = await handle_routes(request);

        // Add CORS headers to response
        return add_cors_headers(response, request);
      } catch (error: any) {
        const error_response = await error_handler(error, request);
        return add_cors_headers(error_response, request);
      }
    },
  };
};