# Bun TypeScript Application with TypeORM and MySQL

A production-grade REST API built with Bun runtime, TypeScript, TypeORM, and MySQL.

## 🚀 Features

- **Bun Runtime** - Fast JavaScript runtime with built-in TypeScript support
- **TypeORM** - Powerful ORM for database management
- **MySQL Database** - Reliable relational database
- **Zod Validation** - Type-safe runtime validation with automatic error formatting
- **Snake Case Convention** - Consistent naming across files, functions, and variables
- **Clean Architecture** - Separation of concerns with controllers, services, and models
- **Error Handling** - Centralized error handling middleware
- **CORS Support** - Configurable CORS middleware
- **Validation** - Input validation utilities with Zod schemas
- **Password Hashing** - Secure password hashing with Bun's built-in bcrypt
- **RESTful API** - Standard REST API design

## 📁 Project Structure

```
bun-app/
├── src/
│   ├── config/
│   │   ├── database.ts       # Database configuration
│   │   └── env.ts             # Environment configuration
│   ├── controllers/
│   │   ├── user_controller.ts # User CRUD operations
│   │   └── index.ts
│   ├── models/
│   │   ├── user.ts            # User entity
│   │   └── index.ts
│   ├── services/
│   │   ├── user_service.ts    # Business logic
│   │   └── index.ts
│   ├── routes/
│   │   ├── user_routes.ts     # User endpoints
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── cors.ts            # CORS middleware
│   │   ├── logger.ts          # Request logger
│   │   ├── error_handler.ts   # Error handling
│   │   └── index.ts
│   ├── schemas/
│   │   ├── user_schema.ts     # User validation schemas
│   │   ├── product_schema.ts  # Product validation schemas (example)
│   │   ├── index.ts
│   │   └── README.md          # Schemas documentation
│   ├── utils/
│   │   ├── password_utils.ts  # Password hashing/verification
│   │   ├── response_utils.ts  # API response helpers
│   │   ├── validation_utils.ts # Input validation
│   │   ├── zod_utils.ts       # Zod validation utilities
│   │   └── index.ts
│   ├── app.ts                 # Application setup
│   └── server.ts              # Entry point
├── tests/                     # Test files
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── QUICK_START.md
└── ZOD_INTEGRATION.md         # Zod validation guide
```

## 🛠️ Installation

1. **Install Bun** (if not already installed):
```bash
curl -fsSL https://bun.sh/install | bash
```

2. **Clone and setup the project**:

```bash
cd bun-app
bun install
```

3. **Configure environment variables**:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Create the database**:

```sql
CREATE DATABASE bun_app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
bun run dev
```

### Production Mode

```bash
bun run start
```

### Build

```bash
bun run build
```

## 📝 API Endpoints

### Health Check

- `GET /` or `GET /health` - Server health check

### User Endpoints

#### Create User

```bash
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user"
}
```

#### Get All Users

```bash
GET /api/users?page=1&limit=10
```

#### Get User by ID

```bash
GET /api/users/{id}
```

#### Update User

```bash
PUT /api/users/{id}
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

#### Delete User

```bash
DELETE /api/users/{id}
```

#### Toggle User Status

```bash
PATCH /api/users/{id}/toggle-status
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_USERNAME` | Database username | root |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | bun_app_db |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed origins | * |

## 🏗️ Architecture

### Controllers
Handle HTTP requests and responses. Validate input and call appropriate services.

### Services
Contain business logic and interact with repositories/models.

### Models
Define database entities using TypeORM decorators.

### Routes
Define API endpoints and route requests to controllers.

### Middlewares
Process requests before they reach controllers (CORS, logging, error handling).

### Schemas
Define Zod validation schemas for request body, query parameters, and route parameters. Each model has its own schema file with create, update, and query schemas.

### Utils
Reusable helper functions for validation, responses, password hashing, etc.

## 🔒 Security Features

- Password hashing using Bun's built-in bcrypt
- Input validation with Zod schemas
- SQL injection protection via TypeORM
- CORS configuration
- Environment-based configuration

## ✅ Validation

The application uses [Zod](https://zod.dev/) for type-safe runtime validation:

- **Declarative schemas** - Define validation rules in `src/schemas/`
- **Automatic type inference** - TypeScript types generated from schemas
- **Detailed error messages** - User-friendly validation errors
- **Request validation** - Body, query params, and route params
- **Data transformation** - Automatic trimming, lowercase conversion, etc.

See [ZOD_INTEGRATION.md](ZOD_INTEGRATION.md) for detailed documentation.

## 📦 Database Migrations

TypeORM supports automatic schema synchronization in development mode (`synchronize: true`). For production, use migrations:

```bash
# Generate migration
bun run migration:generate src/migrations/migration_name

# Run migrations
bun run migration:run

# Revert migration
bun run migration:revert
```

## 🧪 Testing

Add your test files in the `tests/` directory and run:

```bash
bun test
```

## 📚 Code Conventions

- **Naming**: All files, functions, variables, and database columns use `snake_case`
- **TypeScript**: Strong typing throughout the application
- **Error Handling**: Centralized error handling with meaningful messages
- **Response Format**: Consistent API response structure

## 🤝 Contributing

1. Follow the snake_case naming convention
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

## 📄 License

MIT

## 🙏 Acknowledgments

- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- [TypeORM](https://typeorm.io/) - TypeScript ORM
- [MySQL](https://www.mysql.com/) - Relational database