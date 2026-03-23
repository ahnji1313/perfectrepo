```typescript
// User Interface
interface User {
  id: string;
  email: string;
  username: string;
}

// News Interface
interface News {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Login Request Interface
interface LoginRequest {
  email: string;
  password: string;
}

// Login Response Interface
interface LoginResponse {
  token: string;
  user: User;
}

// News Request Interface
interface NewsRequest {
  title: string;
  content: string;
}

// News Response Interface
interface NewsResponse {
  news: News;
}

// Zod Schemas
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
});

const newsSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(4),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

const newsRequestSchema = z.object({
  title: z.string().min(2).max(4),
  content: z.string(),
});

const newsResponseSchema = z.object({
  news: newsSchema,
});

// OpenAPI 3.0 Definitions
const openapiDefinitions = {
  components: {
    schemas: {
      User: userSchema.toJSON(),
      News: newsSchema.toJSON(),
      LoginRequest: loginRequestSchema.toJSON(),
      LoginResponse: loginResponseSchema.toJSON(),
      NewsRequest: newsRequestSchema.toJSON(),
      NewsResponse: newsResponseSchema.toJSON(),
    },
  },
};

// API Endpoints
const apiEndpoints = {
  login: {
    post: {
      summary: 'Login to the system',
      requestBody: {
        content: {
          'application/json': {
            schema: openapiDefinitions.components.schemas.LoginRequest,
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: openapiDefinitions.components.schemas.LoginResponse,
            },
          },
        },
      },
    },
  },
  news: {
    get: {
      summary: 'Get all news',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: openapiDefinitions.components.schemas.News,
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Create a new news',
      requestBody: {
        content: {
          'application/json': {
            schema: openapiDefinitions.components.schemas.NewsRequest,
          },
        },
      },
      responses: {
        201: {
          content: {
            'application/json': {
              schema: openapiDefinitions.components.schemas.NewsResponse,
            },
          },
        },
      },
    },
  },
  'news/{id}': {
    get: {
      summary: 'Get a news by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: openapiDefinitions.components.schemas.News,
            },
          },
        },
      },
    },
    put: {
      summary: 'Update a news',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: openapiDefinitions.components.schemas.NewsRequest,
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: openapiDefinitions.components.schemas.NewsResponse,
            },
          },
        },
      },
    },
    delete: {
      summary: 'Delete a news',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        204: {
          description: 'News deleted successfully',
        },
      },
    },
  },
};

// Netlify Configuration
const netlifyConfig = {
  build: {
    command: 'npm run build',
    publish: 'dist',
  },
  functions: 'functions',
};
```