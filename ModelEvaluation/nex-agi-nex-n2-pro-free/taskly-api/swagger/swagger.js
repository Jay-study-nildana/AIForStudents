const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taskly API',
      version: '1.0.0',
      description: 'REST API for the Taskly task management application with public categories, JWT authentication, RBAC-protected tasks, and Swagger documentation.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Auth',
        description: 'User registration and login'
      },
      {
        name: 'Categories',
        description: 'Public category CRUD'
      },
      {
        name: 'Tasks',
        description: 'JWT-protected task CRUD with role-based access control'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              nullable: true
            },
            meta: {
              type: 'object',
              nullable: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Something went wrong'
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            details: {
              nullable: true
            }
          }
        },
        AuthInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Jay'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jay@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['user', 'manager', 'admin'],
              default: 'user',
              example: 'user'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'jay@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Jay'
            },
            email: {
              type: 'string',
              example: 'jay@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'manager', 'admin'],
              example: 'user'
            },
            created_at: {
              type: 'string',
              example: '2026-06-12 19:07:49'
            }
          }
        },
        AuthResponse: {
          allOf: [
            {
              $ref: '#/components/schemas/Success'
            },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User'
                    },
                    token: {
                      type: 'string',
                      example: 'jwt-token-here'
                    }
                  }
                }
              }
            }
          ]
        },
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Work'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Work'
            },
            created_at: {
              type: 'string',
              example: '2026-06-12 19:51:42'
            }
          }
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              example: 'Build Taskly API'
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Implement CRUD endpoints'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              default: 'todo',
              example: 'todo'
            },
            category_id: {
              type: 'integer',
              nullable: true,
              example: 1
            }
          }
        },
        TaskUpdateInput: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Build Taskly API'
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Updated description'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              example: 'in_progress'
            },
            category_id: {
              type: 'integer',
              nullable: true,
              example: 1
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            title: {
              type: 'string',
              example: 'Build Taskly API'
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Implement CRUD endpoints'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              example: 'todo'
            },
            user_id: {
              type: 'integer',
              example: 1
            },
            category_id: {
              type: 'integer',
              nullable: true,
              example: 1
            },
            created_at: {
              type: 'string',
              example: '2026-06-12 19:51:42'
            },
            updated_at: {
              type: 'string',
              example: '2026-06-12 19:51:42'
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, 'swagger.js')]
};

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Returns API health status.
 *     operationId: getHealth
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user and returns a JWT token.
 *     operationId: registerUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     description: Authenticates a user and returns a JWT token.
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List categories
 *     description: Public endpoint. No authentication required.
 *     operationId: listCategories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *   post:
 *     tags: [Categories]
 *     summary: Create category
 *     description: Public endpoint. No authentication required.
 *     operationId: createCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Duplicate category name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category
 *     description: Public endpoint. No authentication required.
 *     operationId: getCategory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Categories]
 *     summary: Update category
 *     description: Public endpoint. No authentication required.
 *     operationId: updateCategory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Duplicate category name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category
 *     description: Public endpoint. No authentication required.
 *     operationId: deleteCategory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks
 *     description: Users see their own tasks. Managers and admins see all tasks.
 *     operationId: listTasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
 *     description: Authenticated users, managers, and admins can create tasks.
 *     operationId: createTask
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task
 *     description: Users can view their own tasks. Managers and admins can view any task.
 *     operationId: getTask
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Tasks]
 *     summary: Update task
 *     description: Users can update their own tasks. Managers can update any task status only. Admins can update any task.
 *     operationId: updateTask
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     description: Users can delete their own tasks. Admins can delete any task.
 *     operationId: deleteTask
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
