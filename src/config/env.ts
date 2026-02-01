import { config } from "dotenv";

config();

interface env_config {
  port: number;
  node_env: string;
  db_host: string;
  db_port: number;
  db_username: string;
  db_password: string;
  db_database: string;
  jwt_secret: string;
  jwt_expires_in: string;
  cors_origin: string;
}

export const env: env_config = {
  port: parseInt(process.env.PORT || "3000"),
  node_env: process.env.NODE_ENV || "development",
  db_host: process.env.DB_HOST || "localhost",
  db_port: parseInt(process.env.DB_PORT || "3306"),
  db_username: process.env.DB_USERNAME || "root",
  db_password: process.env.DB_PASSWORD || "",
  db_database: process.env.DB_DATABASE || "bun_app_db",
  jwt_secret: process.env.JWT_SECRET || "default_secret_change_in_production",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  cors_origin: process.env.CORS_ORIGIN || "*",
};

export const is_production = env.node_env === "production";
export const is_development = env.node_env === "development";