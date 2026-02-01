import "reflect-metadata";
import { env } from "./config/env";
import { initialize_database } from "./config/database";
import { create_app } from "./app";

const start_server = async () => {
  try {
    // Initialize database connection
    await initialize_database();

    // Create and start the server
    const app = create_app();

    const server = Bun.serve({
      port: env.port,
      fetch: app.fetch,
    });

    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║  🚀 Server is running!                     ║
║                                            ║
║  Environment: ${env.node_env.padEnd(27)}  ║
║  Port: ${String(env.port).padEnd(33)}   ║
║  URL: http://localhost:${env.port}${" ".repeat(19 - String(env.port).length)} ║
║                                            ║
╚════════════════════════════════════════════╝
    `);

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down gracefully...");
      server.stop();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n🛑 Shutting down gracefully...");
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start_server();