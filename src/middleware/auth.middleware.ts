import { res } from "../utils/res";

export const authMiddleware = (handler: (req: Request) => Promise<Response>) => {
  return async (req: Request): Promise<Response> => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res({ error: "Unauthorized" }, 401);
    }
    // For simplicity, assume any Bearer token is valid
    // In real app, verify JWT or something
    return handler(req);
  };
};