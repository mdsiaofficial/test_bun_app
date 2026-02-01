import {
  create_user_controller,
  get_user_by_id_controller,
  get_all_users_controller,
  update_user_controller,
  delete_user_controller,
  toggle_user_status_controller,
} from "../controllers/user_controller";

export const user_routes = async (
  request: Request,
  path: string
): Promise<Response | null> => {
  const url = new URL(request.url);
  const method = request.method;

  // GET /api/users - Get all users
  if (method === "GET" && path === "/api/users") {
    return await get_all_users_controller(request);
  }

  // POST /api/users - Create a new user
  if (method === "POST" && path === "/api/users") {
    return await create_user_controller(request);
  }

  // GET /api/users/:id - Get user by ID
  const get_user_match = path.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (method === "GET" && get_user_match) {
    return await get_user_by_id_controller(request, { id: get_user_match[1] });
  }

  // PUT /api/users/:id - Update user
  const update_user_match = path.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (method === "PUT" && update_user_match) {
    return await update_user_controller(request, { id: update_user_match[1] });
  }

  // DELETE /api/users/:id - Delete user
  const delete_user_match = path.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (method === "DELETE" && delete_user_match) {
    return await delete_user_controller(request, { id: delete_user_match[1] });
  }

  // PATCH /api/users/:id/toggle-status - Toggle user status
  const toggle_status_match = path.match(/^\/api\/users\/([a-zA-Z0-9-]+)\/toggle-status$/);
  if (method === "PATCH" && toggle_status_match) {
    return await toggle_user_status_controller(request, { id: toggle_status_match[1] });
  }

  return null;
};