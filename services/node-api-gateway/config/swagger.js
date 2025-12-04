const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API Gateway',
      version: '1.0.0',
      description: 'REST API for Job Portal System with User Management and Job Listings',
      contact: {
        name: 'API Support',
        email: 'support@jobportal.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Development Server (Fallback)',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'john@example.com' },
            password_hash: { type: 'string', example: 'hashed_password' },
            user_type: { type: 'string', enum: ['candidate', 'hr', 'admin'], example: 'candidate' },
            full_name: { type: 'string', example: 'John Doe' },
            phone: { type: 'string', example: '0123456789' },
            avatar_url: { type: 'string', example: 'https://example.com/avatar.jpg' },
            is_verified: { type: 'boolean', example: false },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            slug: { type: 'string', example: 'senior-nodejs-dev' },
            title: { type: 'string', example: 'Senior Node.js Developer' },
            employer_id: { type: 'integer', example: 1 },
            location: { type: 'string', example: 'Ho Chi Minh City' },
            job_type: { type: 'string', enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'] },
            category: { type: 'string', example: 'Engineering' },
            salary_min: { type: 'integer', example: 15000000 },
            salary_max: { type: 'integer', example: 25000000 },
            description: { type: 'string', example: 'Looking for experienced Node.js developer' },
            status: { type: 'string', enum: ['draft', 'active', 'closed', 'paused'] },
            view_count: { type: 'integer', example: 0 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            count: { type: 'integer' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [
    './routes/users.js',
    './routes/jobs.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
