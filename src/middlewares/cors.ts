import { env } from "../config/env";

export const cors_middleware = (request: Request): Response | null => {
  const origin = request.headers.get("origin");
  const allowed_origins = env.cors_origin.split(",").map((o) => o.trim());

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowed_origins.includes("*") || (origin && allowed_origins.includes(origin))
          ? origin || "*"
          : allowed_origins[0],
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  return null;
};

export const add_cors_headers = (response: Response, request: Request): Response => {
  const origin = request.headers.get("origin");
  const allowed_origins = env.cors_origin.split(",").map((o) => o.trim());

  const new_headers = new Headers(response.headers);
  new_headers.set(
    "Access-Control-Allow-Origin",
    allowed_origins.includes("*") || (origin && allowed_origins.includes(origin))
      ? origin || "*"
      : allowed_origins[0]
  );
  new_headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  new_headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new_headers,
  });
};