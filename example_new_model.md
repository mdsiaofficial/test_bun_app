# Complete Example: Adding a New Model with Zod Validation

This guide shows a complete example of adding a new "Post" model to the application with full Zod validation.

## 📋 Steps Overview

1. Create the TypeORM model
2. Create the Zod validation schema
3. Create the service
4. Create the controller
5. Create the routes
6. Update exports

---

## Step 1: Create the TypeORM Model

**File:** `src/models/post.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./user";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  slug: string;

  @Column({ type: "boolean", default: false })
  published: boolean;

  @Index()
  @Column({ type: "uuid" })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "int", default: 0 })
  view_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

Update `src/models/index.ts`:
```typescript
export { User } from "./user";
export { Post } from "./post";
```

---

## Step 2: Create the Zod Validation Schema

**File:** `src/schemas/post_schema.ts`

```typescript
import { z } from "zod";

// Slug validation helper
const slug_schema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
  .max(100, "Slug must not exceed 100 characters")
  .optional();

// Create post schema
export const create_post_schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .trim(),
  slug: slug_schema,
  published: z.boolean().default(false),
  user_id: z.string().uuid("Invalid user ID format"),
});

// Update post schema (all fields optional)
export const update_post_schema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .optional(),
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .trim()
    .optional(),
  slug: slug_schema,
  published: z.boolean().optional(),
});

// Query parameters schema
export const post_query_schema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val))
    .pipe(z.number().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val))
    .pipe(
      z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100")
    ),
  published: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .pipe(z.boolean()),
  user_id: z.string().uuid("Invalid user ID format").optional(),
});

// Type exports
export type create_post_input = z.infer<typeof create_post_schema>;
export type update_post_input = z.infer<typeof update_post_schema>;
export type post_query_params = z.infer<typeof post_query_schema>;
```

Update `src/schemas/index.ts`:
```typescript
export * from "./user_schema";
export * from "./product_schema";
export * from "./post_schema";
```

---

## Step 3: Create the Service

**File:** `src/services/post_service.ts`

```typescript
import { Repository, FindOptionsWhere } from "typeorm";
import { app_data_source } from "../config/database";
import { Post } from "../models/post";

export class PostService {
  private post_repository: Repository<Post>;

  constructor() {
    this.post_repository = app_data_source.getRepository(Post);
  }

  async create_post(data: {
    title: string;
    content: string;
    slug?: string;
    published: boolean;
    user_id: string;
  }): Promise<Post> {
    const post = this.post_repository.create(data);
    return await this.post_repository.save(post);
  }

  async get_post_by_id(id: string): Promise<Post | null> {
    return await this.post_repository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async get_all_posts(options: {
    skip?: number;
    take?: number;
    published?: boolean;
    user_id?: string;
  }): Promise<{ posts: Post[]; total: number }> {
    const where: FindOptionsWhere<Post> = {};

    if (options.published !== undefined) {
      where.published = options.published;
    }

    if (options.user_id) {
      where.user_id = options.user_id;
    }

    const [posts, total] = await this.post_repository.findAndCount({
      where,
      skip: options.skip || 0,
      take: options.take || 10,
      order: { created_at: "DESC" },
      relations: ["user"],
    });

    return { posts, total };
  }

  async update_post(id: string, data: Partial<Post>): Promise<Post> {
    const post = await this.get_post_by_id(id);

    if (!post) {
      throw new Error("Post not found");
    }

    Object.assign(post, data);
    return await this.post_repository.save(post);
  }

  async delete_post(id: string): Promise<void> {
    const result = await this.post_repository.delete(id);

    if (result.affected === 0) {
      throw new Error("Post not found");
    }
  }

  async increment_view_count(id: string): Promise<void> {
    await this.post_repository.increment({ id }, "view_count", 1);
  }
}
```

Update `src/services/index.ts`:
```typescript
export { UserService } from "./user_service";
export { PostService } from "./post_service";
```

---

## Step 4: Create the Controller

**File:** `src/controllers/post_controller.ts`

```typescript
import { PostService } from "../services/post_service";
import {
  success_response,
  error_response,
  not_found_response,
  validation_error_response,
} from "../utils/response_utils";
import { validate_schema } from "../utils/zod_utils";
import {
  create_post_schema,
  update_post_schema,
  post_query_schema,
} from "../schemas/post_schema";
import { uuid_param_schema } from "../schemas/user_schema";

const post_service = new PostService();

export const create_post_controller = async (
  request: Request
): Promise<Response> => {
  try {
    const body = await request.json();

    const validation = validate_schema(create_post_schema, body);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const post = await post_service.create_post(validation.data);

    return success_response(post, "Post created successfully", 201);
  } catch (error: any) {
    return error_response(error.message, 400);
  }
};

export const get_post_by_id_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const validation = validate_schema(uuid_param_schema, params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const post = await post_service.get_post_by_id(validation.data.id);

    if (!post) {
      return not_found_response("Post not found");
    }

    // Increment view count
    await post_service.increment_view_count(post.id);

    return success_response(post);
  } catch (error: any) {
    return error_response(error.message);
  }
};

export const get_all_posts_controller = async (
  request: Request
): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const query_params = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "10",
      published: url.searchParams.get("published") || undefined,
      user_id: url.searchParams.get("user_id") || undefined,
    };

    const validation = validate_schema(post_query_schema, query_params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    const { page, limit, published, user_id } = validation.data;
    const skip = (page - 1) * limit;

    const { posts, total } = await post_service.get_all_posts({
      skip,
      take: limit,
      published,
      user_id,
    });

    return success_response({
      posts,
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

export const update_post_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const param_validation = validate_schema(uuid_param_schema, params);

    if (!param_validation.success) {
      return validation_error_response(param_validation.errors);
    }

    const body = await request.json();

    const body_validation = validate_schema(update_post_schema, body);

    if (!body_validation.success) {
      return validation_error_response(body_validation.errors);
    }

    const post = await post_service.update_post(
      param_validation.data.id,
      body_validation.data
    );

    return success_response(post, "Post updated successfully");
  } catch (error: any) {
    return error_response(error.message);
  }
};

export const delete_post_controller = async (
  request: Request,
  params: { id: string }
): Promise<Response> => {
  try {
    const validation = validate_schema(uuid_param_schema, params);

    if (!validation.success) {
      return validation_error_response(validation.errors);
    }

    await post_service.delete_post(validation.data.id);

    return success_response(null, "Post deleted successfully");
  } catch (error: any) {
    return error_response(error.message);
  }
};
```

Update `src/controllers/index.ts`:
```typescript
export * from "./user_controller";
export * from "./post_controller";
```

---

## Step 5: Create the Routes

**File:** `src/routes/post_routes.ts`

```typescript
import {
  create_post_controller,
  get_post_by_id_controller,
  get_all_posts_controller,
  update_post_controller,
  delete_post_controller,
} from "../controllers/post_controller";

export const post_routes = async (
  request: Request,
  path: string
): Promise<Response | null> => {
  const method = request.method;

  // GET /api/posts - Get all posts
  if (method === "GET" && path === "/api/posts") {
    return await get_all_posts_controller(request);
  }

  // POST /api/posts - Create a new post
  if (method === "POST" && path === "/api/posts") {
    return await create_post_controller(request);
  }

  // GET /api/posts/:id - Get post by ID
  const get_post_match = path.match(/^\/api\/posts\/([a-zA-Z0-9-]+)$/);
  if (method === "GET" && get_post_match) {
    return await get_post_by_id_controller(request, { id: get_post_match[1] });
  }

  // PUT /api/posts/:id - Update post
  const update_post_match = path.match(/^\/api\/posts\/([a-zA-Z0-9-]+)$/);
  if (method === "PUT" && update_post_match) {
    return await update_post_controller(request, { id: update_post_match[1] });
  }

  // DELETE /api/posts/:id - Delete post
  const delete_post_match = path.match(/^\/api\/posts\/([a-zA-Z0-9-]+)$/);
  if (method === "DELETE" && delete_post_match) {
    return await delete_post_controller(request, { id: delete_post_match[1] });
  }

  return null;
};
```

Update `src/routes/index.ts`:
```typescript
import { user_routes } from "./user_routes";
import { post_routes } from "./post_routes";
import { not_found_response } from "../utils/response_utils";

export const handle_routes = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Health check endpoint
  if (path === "/health" || path === "/") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // User routes
  const user_response = await user_routes(request, path);
  if (user_response) {
    return user_response;
  }

  // Post routes
  const post_response = await post_routes(request, path);
  if (post_response) {
    return post_response;
  }

  // 404 Not Found
  return not_found_response("Route not found");
};
```

---

## 🎉 Complete! Now You Can:

### Create a Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post",
    "slug": "my-first-post",
    "published": true,
    "user_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Get All Posts
```bash
curl "http://localhost:3000/api/posts?page=1&limit=10&published=true"
```

### Get Post by ID
```bash
curl http://localhost:3000/api/posts/123e4567-e89b-12d3-a456-426614174000
```

### Update Post
```bash
curl -X PUT http://localhost:3000/api/posts/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "published": true
  }'
```

### Delete Post
```bash
curl -X DELETE http://localhost:3000/api/posts/123e4567-e89b-12d3-a456-426614174000
```

---

## ✅ Validation Examples

### Valid Request
```json
{
  "title": "Great Post",
  "content": "Awesome content here",
  "published": true,
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```
✅ Success: Post created

### Invalid Request
```json
{
  "title": "",
  "content": "Some content",
  "user_id": "invalid-uuid"
}
```
❌ Error Response:
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "title": ["Title is required"],
    "user_id": ["Invalid user ID format"]
  }
}
```

---

## 🎓 Key Takeaways

1. **Type Safety** - All validated data is automatically typed
2. **Reusability** - Schemas can be reused across the app
3. **Consistency** - Same validation pattern for all models
4. **Maintainability** - Changes to validation in one place
5. **Developer Experience** - Clear errors and autocomplete

---

This example demonstrates the complete workflow for adding a new model with Zod validation. Follow this pattern for any new models you create!