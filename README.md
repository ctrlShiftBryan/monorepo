# **Project Name**

A Node.js backend application built with TypeScript, Fastify, Prisma, and Nx Monorepo, following Feature-Sliced Design principles and functional programming practices.

---

## **Table of Contents**

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Feature Implementation](#feature-implementation)
- [Getting Started](#getting-started)
- [Scripts and Commands](#scripts-and-commands)
- [Contributing](#contributing)
- [License](#license)

---

## **Introduction**

This project is a Node.js backend application that serves as a REST API over a PostgreSQL database. It is a rewrite of an existing Rails 6 app, aiming to leverage modern technologies and architectural patterns for improved scalability, maintainability, and developer experience.

The application is built using:

- **TypeScript** for static typing and improved developer tooling.
- **Fastify** as the web framework for its speed and low overhead.
- **Prisma** as the ORM for database interactions with PostgreSQL.
- **Nx Monorepo** to manage the project structure and dependencies.
- **Feature-Sliced Design** to organize code into self-contained features.
- **Functional Programming Principles** to promote immutability and pure functions.

---

## **Technologies Used**

- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Fastify**: A web framework for Node.js focused on performance and low overhead.
- **Prisma**: A next-generation ORM for TypeScript and Node.js.
- **Nx Monorepo**: A smart, fast, and extensible build system with first-class monorepo support.
- **Zod**: A TypeScript-first schema validation library.
- **PostgreSQL**: An open-source relational database.

---

## **Project Architecture**

The application follows a modular, layered architecture inspired by **Feature-Sliced Design**. Each feature is a vertical slice of functionality, containing all the necessary components such as models, services, controllers, and routes.

Key architectural principles:

- **Modularity**: Features are self-contained, promoting scalability and maintainability.
- **Separation of Concerns**: Each layer within a feature has a specific responsibility.
- **Functional Programming**: Emphasis on pure functions and immutability; no classes are used.
- **Type Safety**: Extensive use of TypeScript types and interfaces for robustness.
- **Validation**: Use of Zod schemas for data validation and type inference.

---

## **Project Structure**

```
/apps
  /api            # Fastify application entry point
/libs
  /shared         # Shared utilities and global types
  /database       # Prisma schema and client setup
/features         # Feature slices
  /<feature-name>
    /api          # API routes and controllers
    /model        # Feature-specific models and Zod schemas
      <feature>.model.ts
      <feature>.schema.ts
    /service      # Business logic
    /repository   # Data access using Prisma
    /types        # Feature-specific types and interfaces
```

---

### **Detailed Breakdown**

#### **1. Apps**

- **/apps/api**

  - **Purpose**: Entry point for the Fastify application.
  - **Contents**: Server setup, plugin registration, and bootstrapping.

#### **2. Libs**

##### **a. Shared Layer (`/libs/shared`)**

- **Purpose**: Contains shared utilities, global types, and configurations.
- **Contents**:
  - **Utilities**: Helper functions, constants.
  - **Types**: Global TypeScript types and interfaces.
  - **Middleware**: Common middleware functions.
  - **Validation**: Shared Zod schemas or validation utilities, if any.

##### **b. Database Layer (`/libs/database`)**

- **Purpose**: Manages the Prisma schema and client setup.
- **Contents**:
  - **Prisma Schema**: Defines database models and relationships.
  - **Prisma Client**: Generated client for type-safe database interactions.
  - **Configuration**: Database connection settings.

#### **3. Features (`/features`)**

Each feature represents a vertical slice of the application and is self-contained.

- **Structure**:

  ```
  /features
    /<feature-name>
      /api
        <feature>.controller.ts
        <feature>.route.ts
      /model
        <feature>.model.ts
        <feature>.schema.ts
      /service
        <feature>.service.ts
      /repository
        <feature>.repository.ts
      /types
        index.ts
  ```

- **Explanation**:

  - **api**: Handles HTTP requests and responses.
  - **model**: Contains Prisma model types and Zod schemas for validation.
  - **service**: Implements business logic and orchestrates operations.
  - **repository**: Manages data access using Prisma client.
  - **types**: Feature-specific TypeScript types and interfaces.

---

## **Feature Implementation**

Let's explore how a feature, such as `User`, is implemented following this structure.

### **1. User Feature Structure**

```
/features
  /user
    /api
      user.controller.ts
      user.route.ts
    /model
      user.model.ts
      user.schema.ts
    /service
      user.service.ts
    /repository
      user.repository.ts
    /types
      index.ts
```

### **2. Component Explanations**

#### **a. Model Layer (`/model`)**

- **user.model.ts**

  ```typescript
  import { User } from '@prisma/client';

  // Re-exporting Prisma User type for convenience
  export type { User };
  ```

- **user.schema.ts**

  ```typescript
  import { z } from 'zod';

  // Define the schema for creating a user
  export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    // Additional fields and validations
  });

  // Define the schema for user ID parameter
  export const userIdSchema = z.object({
    id: z.string().uuid('Invalid user ID format'),
  });

  // Infer TypeScript types from Zod schemas
  export type CreateUserInput = z.infer<typeof createUserSchema>;
  export type UserIdParams = z.infer<typeof userIdSchema>;
  ```

#### **b. Repository Layer (`/repository`)**

- **user.repository.ts**

  ```typescript
  import prisma from '@myorg/database/client';
  import { CreateUserInput } from '../model/user.schema';

  export const findUserById = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  };

  export const createUser = async (userData: CreateUserInput) => {
    return prisma.user.create({ data: userData });
  };

  // Additional data access methods
  ```

#### **c. Service Layer (`/service`)**

- **user.service.ts**

  ```typescript
  import { User } from '../model/user.model';
  import { CreateUserInput } from '../model/user.schema';
  import { createUser, findUserById } from '../repository/user.repository';

  export const registerUser = async (userData: CreateUserInput): Promise<User> => {
    // Business logic (e.g., checking for existing email)
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email is already in use');
    }
    return createUser(userData);
  };

  export const getUserProfile = async (id: string): Promise<User | null> => {
    return findUserById(id);
  };

  // Helper function
  const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };
  ```

#### **d. API Layer (`/api`)**

- **user.controller.ts**

  ```typescript
  import { FastifyReply, FastifyRequest } from 'fastify';
  import { CreateUserInput, UserIdParams } from '../model/user.schema';
  import { getUserProfile, registerUser } from '../service/user.service';

  export const registerUserHandler = async (req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) => {
    try {
      const user = await registerUser(req.body);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  };

  export const getUserProfileHandler = async (req: FastifyRequest<{ Params: UserIdParams }>, reply: FastifyReply) => {
    try {
      const user = await getUserProfile(req.params.id);
      if (user) {
        reply.send(user);
      } else {
        reply.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  };
  ```

- **user.route.ts**

  ```typescript
  import { FastifyInstance } from 'fastify';
  import { createUserSchema, userIdSchema } from '../model/user.schema';
  import { getUserProfileHandler, registerUserHandler } from './user.controller';

  export const userRoutes = async (app: FastifyInstance) => {
    app.post(
      '/users',
      {
        preHandler: [validateRequestBody(createUserSchema)],
      },
      registerUserHandler
    );

    app.get(
      '/users/:id',
      {
        preHandler: [validateRequestParams(userIdSchema)],
      },
      getUserProfileHandler
    );
  };

  // Validation middleware for request body
  function validateRequestBody(schema) {
    return async (req, reply) => {
      try {
        req.body = await schema.parseAsync(req.body);
      } catch (error) {
        reply.status(400).send({ error: error.errors });
      }
    };
  }

  // Validation middleware for request params
  function validateRequestParams(schema) {
    return async (req, reply) => {
      try {
        req.params = await schema.parseAsync(req.params);
      } catch (error) {
        reply.status(400).send({ error: error.errors });
      }
    };
  }
  ```

#### **e. Types Layer (`/types`)**

- **index.ts**

  ```typescript
  // Export feature-specific types
  export type UserDTO = {
    id: string;
    name: string;
    email: string;
    // Additional fields as needed
  };
  ```

---

## **Getting Started**

### **Prerequisites**

- **Node.js** (version 14 or higher)
- **npm** or **Yarn** package manager
- **PostgreSQL** database

### **Installation Steps**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/your-database-name
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Run Database Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the Application**

   ```bash
   nx serve api
   ```

   Or directly using ts-node:

   ```bash
   npx ts-node apps/api/main.ts
   ```

---

## **Scripts and Commands**

- **Start the Development Server**

  ```bash
  nx serve api
  ```

- **Build the Application**

  ```bash
  nx build api
  ```

- **Run Tests**

  ```bash
  nx test
  ```

- **Generate Prisma Client**

  ```bash
  npx prisma generate
  ```

- **Run Database Migrations**

  ```bash
  npx prisma migrate dev --name migration_name
  ```

- **Format Code**

  ```bash
  nx format
  ```

- **Lint Code**

  ```bash
  nx lint
  ```

---

## **Contributing**

We welcome contributions to this project. Please follow these steps:

1. **Fork the Repository**

   Click the "Fork" button at the top right of the repository page.

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Your detailed description of the changes."
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

   Submit a pull request to the `main` branch of the original repository.

---

## **License**

This project is licensed under the MIT License.

---

## **Additional Information**

### **1. Mapping to Rails Concepts**

- **Models**: Prisma models and Zod schemas in the `model` layer correspond to Rails models with validations.
- **Controllers**: Fastify controllers handle requests and responses, similar to Rails controllers.
- **Services**: Business logic in services mirrors Rails service objects or concerns.
- **Routes**: Fastify routes correspond to Rails routes but are organized within each feature.
- **Validations**: Zod schemas provide validation akin to Rails' ActiveModel validations.

### **2. Functional Programming Practices**

- **No Classes**: The codebase uses functions and TypeScript types/interfaces instead of classes.
- **Immutability**: Data structures are treated as immutable wherever possible.
- **Pure Functions**: Business logic aims to be pure functions, improving testability and predictability.

### **3. Type Safety with TypeScript**

- **Strict Typing**: The project uses TypeScript's strict mode for robust type checking.
- **Type Inference**: Types are inferred from Zod schemas to ensure consistency between validation and type definitions.
- **Avoiding `any`**: The `any` type is avoided to maintain type safety across the codebase.

### **4. Using Nx Monorepo**

- **Modular Libraries**: Nx manages multiple libraries (`/libs`) and applications (`/apps`) efficiently.
- **Dependency Graph**: Nx provides tools to visualize and manage dependencies between features.
- **Code Generation**: Use Nx generators to create consistent scaffolding for new features.

### **5. Validation with Zod**

- **Schema Definitions**: Zod schemas are placed in the `model` layer of each feature.
- **Request Validation**: Incoming requests are validated using Zod schemas before processing.
- **Type Inference**: Types are inferred from schemas, ensuring that types and validation logic are always synchronized.

### **6. Testing**

- **Unit Tests**: Write unit tests for services and repositories within each feature.
- **Integration Tests**: Test the interaction between layers, especially API endpoints.
- **Testing Tools**: Use frameworks like Jest for unit tests and Supertest for integration tests.

---

## **FAQs**

### **Q1: How do I add a new feature?**

Use the Nx generators or manually create a new directory under `/features` following the existing structure. Ensure you:

- Define models and schemas in the `model` layer.
- Implement data access in the `repository` layer.
- Write business logic in the `service` layer.
- Handle requests and responses in the `api` layer.

### **Q2: How do I handle environment variables?**

Store sensitive information and configuration in environment variables. Use a `.env` file during development and configure your production environment accordingly.

### **Q3: Can I use classes if needed?**

While the project emphasizes functional programming and avoids classes, you can use classes if they significantly simplify your implementation. However, consistency across the codebase is encouraged.

### **Q4: How do I perform input validation?**

Use Zod schemas defined in the `model` layer of each feature. Apply validation in the route handlers using middleware functions.

### **Q5: How do I contribute to the shared utilities?**

Add utilities, types, or middleware functions to the `/libs/shared` directory. Ensure that they are generic and can be used across multiple features.

---

## **Contact**

For any questions or support, please open an issue on the repository or contact the maintainer at [your-email@example.com].

---

**Happy Coding!**

## Testing Strategy: Integration vs E2E Tests

Our project employs both integration and end-to-end (E2E) tests using Supertest and fetch API respectively. Understanding the differences and use cases for each is crucial for maintaining a robust test suite.

### Integration Tests with Supertest

Integration tests verify that different parts of the application work together correctly. We use Supertest for these tests.

Pros:

- Fast execution compared to full E2E tests
- Tests the full HTTP stack without external network calls
- Simulates HTTP requests without starting a real server
- Good for testing API endpoints and middleware

Cons:

- Doesn't test real-world scenarios like CORS or network latency
- May not catch issues related to the actual server listening process

Example usage:

```typescript
const response = await request.get('/');
expect(response.status).toBe(200);
expect(response.body).toEqual({ message: 'Hello API' });
```

### E2E Tests with Fetch API

E2E tests simulate real-world usage of the application. We use the Fetch API for these tests.

Pros:

- Tests the application as a real user or client would
- Catches issues related to CORS, real network behavior, and server listening
- Verifies the entire system works together in a production-like environment

Cons:

- Slower execution due to actual network calls
- Requires managing server lifecycle (start/stop) for tests
- May be less stable due to network dependencies

Example usage:

```typescript
const response = await fetch(`${baseUrl}/`);
const data = await response.json();
expect(response.status).toBe(200);
expect(data).toEqual({ message: 'Hello API' });
```

### When to Use Each

- Use Supertest (Integration Tests) for:

  - Testing API endpoints
  - Verifying middleware behavior
  - Checking request/response handling

- Use Fetch API (E2E Tests) for:
  - Simulating real client-server interactions
  - Testing CORS and other network-related behaviors
  - Verifying the application works in a production-like environment

By combining both approaches, we ensure comprehensive test coverage while maintaining a balance between test speed and real-world scenario validation.
