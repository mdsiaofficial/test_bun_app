import { res } from "./res";

export const asyncHandler = (fn: (req: Request) => Promise<Response>) => {
  return async (req: Request): Promise<Response> => {
    try {
      return await fn(req);
    } catch (error) {
      console.error("Error in async handler:", error);
      return res({ error: "Internal Server Error" }, 500);
    }
  };
};