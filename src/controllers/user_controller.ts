import { UserService } from "../services/user_service";
import {
  success_response,
  error_response,
  not_found_response,
  validation_error_response,
} from "../utils/response_utils";
import { validate_schema } from "../utils/zod_utils";
import {
  create_user_schema,
  update_user_schema,
  user_query_schema,
  uuid_param_schema,
} from "../schemas/user_schema";

const user_service = new UserService();

export const create_user_controller = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validation = validate_schema(create_user_schema, body);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const user = await user_service.create_user(validation.data);

    const { password, ...user_without_password } = user;

    return success_response(
      user_without_password,
      "User created successfully",
      201
    );
  } catch (error: any) {
    return error_response(error.message, 400);
  }
};

export const get_user_by_id_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    // Validate UUID parameter
    const validation = validate_schema(uuid_param_schema, params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const user = await user_service.get_user_by_id(validation.data.id);

    if (!user) {
      return not_found_response("User not found");
    }

    const { password, ...user_without_password } = user;

    return success_response(user_without_password);
  } catch (error: any) {
    return error_response(error.message);
  }
};

export const get_all_users_controller = async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const query_params = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "10",
    };

    // Validate query parameters
    const validation = validate_schema(user_query_schema, query_params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const { page, limit } = validation.data;
    const skip = (page - 1) * limit;

    const { users, total } = await user_service.get_all_users({
      skip,
      take: limit,
    });

    const users_without_passwords = users.map((user) => {
      const { password, ...user_data } = user;
      return user_data;
    });

    return success_response({
      users: users_without_passwords,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return error_response(error.message);
  }
};

export const update_user_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    // Validate UUID parameter
    const param_validation = validate_schema(uuid_param_schema, params);

    if (!param_validation.success) {
      return validation_error_response(param_validation.errors);
    }

    const body = await request.json();

    // Validate request body
    const body_validation = validate_schema(update_user_schema, body);

    if (!body_validation.success) {
      return validation_error_response(body_validation.errors);
    }

    const user = await user_service.update_user(
      param_validation.data.id,
      body_validation.data
    );

    const { password, ...user_without_password } = user;

    return success_response(user_without_password, "User updated successfully");
  } catch (error: any) {
    return error_response(error.message);
  }
};

export const delete_user_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    // Validate UUID parameter
    const validation = validate_schema(uuid_param_schema, params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    await user_service.delete_user(validation.data.id);

    return success_response(null, "User deleted successfully");
  } catch (error: any) {
    return error_response(error.message);
  }
};

export const toggle_user_status_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    // Validate UUID parameter
    const validation = validate_schema(uuid_param_schema, params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const user = await user_service.toggle_user_status(validation.data.id);

    const { password, ...user_without_password } = user;

    return success_response(
      user_without_password,
      `User ${user.is_active ? "activated" : "deactivated"} successfully`
    );
  } catch (error: any) {
    return error_response(error.message);
  }
};