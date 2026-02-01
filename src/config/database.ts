import { DataSource } from "typeorm";
import "reflect-metadata";

const is_production = process.env.NODE_ENV === "production";

export const app_data_source = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "bun_app_db",
  synchronize: true, // Auto-sync schema in development only
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/m?igrations/**/*.ts"],
  
  // subscribers: [],
  // charset: "utf8mb4",
  // timezone: "Z",
  // extra: {
  //   connectionLimit: 10,
  // },
});

export const initialize_database = async (): Promise<void> => {
  try {
    await app_data_source.initialize();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Error during database initialization:", error);
    throw error;
  }
};