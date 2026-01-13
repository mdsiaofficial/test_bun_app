import { asyncHandler } from "../utils/async_handler";
import { UserModel } from "../model/user";
import { res } from "../utils/res";

export const getUsers = asyncHandler(async (req: Request): Promise<Response> => {
  const users = UserModel.getAllUsers();
  return res(users, 200);
});

export const getUserById = asyncHandler(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '0');
  const user = UserModel.getUserById(id);
  if (!user) {
    return res({ error: "User not found" }, 404);
  }
  return res(user, 200);
});

export const createUser = asyncHandler(async (req: Request): Promise<Response> => {
  const body = await req.json() as { name: string; email?: string };
  const { name, email } = body;
  if (!name) {
    return res({ error: "Name is required" }, 400);
  }
  const newUser = UserModel.addUser({ name, email });
  return res(newUser, 201);
});