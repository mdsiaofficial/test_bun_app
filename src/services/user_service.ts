import { Repository } from "typeorm";
import { app_data_source } from "../config/database";
import { User } from "../models/user";
import { hash_password } from "@/utils/password_utils";

export class UserService {
  private user_repository: Repository<User>;

  constructor() {
    this.user_repository = app_data_source.getRepository(User);
  }

  async create_user(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: "user" | "admin";
  }): Promise<User> {
    const existing_user = await this.user_repository.findOne({
      where: { email: data.email },
    });

    if (existing_user) {
      throw new Error("User with this email already exists");
    }

    const hashed_password = await hash_password(data.password);

    const user = this.user_repository.create({
      email: data.email,
      password: hashed_password,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role || "user",
    });

    return await this.user_repository.save(user);
  }

  async get_user_by_id(id: string): Promise<User | null> {
    return await this.user_repository.findOne({ where: { id } });
  }

  async get_user_by_email(email: string): Promise<User | null> {
    return await this.user_repository.findOne({ where: { email } });
  }

  async get_all_users(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.user_repository.findAndCount({
      skip: options?.skip || 0,
      take: options?.take || 10,
      order: { created_at: "DESC" },
    });

    return { users, total };
  }

  async update_user(
    id: string,
    data: Partial<Omit<User, "id" | "created_at" | "updated_at">>
  ): Promise<User> {
    const user = await this.get_user_by_id(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.password) {
      data.password = await hash_password(data.password);
    }

    Object.assign(user, data);
    return await this.user_repository.save(user);
  }

  async delete_user(id: string): Promise<void> {
    const result = await this.user_repository.delete(id);

    if (result.affected === 0) {
      throw new Error("User not found");
    }
  }

  async toggle_user_status(id: string): Promise<User> {
    const user = await this.get_user_by_id(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.is_active = !user.is_active;
    return await this.user_repository.save(user);
  }
}