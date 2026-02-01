export const logger_middleware = (request: Request): void => {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(`[${timestamp}] ${method} ${path}`);
};