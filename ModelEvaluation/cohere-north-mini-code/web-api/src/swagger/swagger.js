const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taskly API',
      version: '1.0.0',
      description: 'A comprehensive task management REST API with JWT authentication and Role-Based Access Control (RBAC)',
      contact: {
        name: 'Taskly API Team',
        email: 'support@taskly.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.taskly.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'manager', 'admin'],
              description: 'User role'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Category ID'
            },
            name: {
              type: 'string',
              description: 'Category name'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Category creation timestamp'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Task ID'
            },
            title: {
              type: 'string',
              description: 'Task title'
            },
            description: {
              type: 'string',
              description: 'Task description'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              description: 'Task status'
            },
            user_id: {
              type: 'integer',
              description: 'ID of the user who owns this task'
            },
            category_id: {
              type: 'integer',
              description: 'ID of the category (optional)'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT authentication token'
                }
              }
            },
            message: {
              type: 'string'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/controllers/*.js',
    './src/routes/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;