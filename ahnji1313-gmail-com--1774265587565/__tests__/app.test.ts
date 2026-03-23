**jest.config.js**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['**/*.ts', '!**/*.d.ts'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
    },
  },
};
```

**src/services/user.service.ts**
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUser(id: number): Promise<any> {
    // Simulating a database query
    return { id, name: 'John Doe' };
  }

  async createUser(user: any): Promise<any> {
    // Simulating a database query
    return { id: 1, ...user };
  }

  async updateUser(id: number, user: any): Promise<any> {
    // Simulating a database query
    return { id, ...user };
  }

  async deleteUser(id: number): Promise<any> {
    // Simulating a database query
    return { id };
  }
}
```

**src/services/user.service.spec.ts**
```typescript
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user by id', async () => {
    const user = await service.getUser(1);
    expect(user).toEqual({ id: 1, name: 'John Doe' });
  });

  it('should create user', async () => {
    const user = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    const createdUser = await service.createUser(user);
    expect(createdUser).toEqual({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
  });

  it('should update user', async () => {
    const user = { name: 'Jane Doe Updated', email: 'jane.doe.updated@example.com' };
    const updatedUser = await service.updateUser(1, user);
    expect(updatedUser).toEqual({ id: 1, name: 'Jane Doe Updated', email: 'jane.doe.updated@example.com' });
  });

  it('should delete user', async () => {
    const deletedUser = await service.deleteUser(1);
    expect(deletedUser).toEqual({ id: 1 });
  });
});
```

**src/app.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './services/user.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
```

**src/app.controller.ts**
```typescript
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './services/user.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<any> {
    return this.userService.getUser(id);
  }

  @Post()
  async createUser(@Body() user: any): Promise<any> {
    return this.userService.createUser(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() user: any): Promise<any> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
```

**src/main.ts**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
```

**jest.setupTests.ts**
```typescript
import { Test } from '@nestjs/testing';
import { SupertestModule } from '@nestjs/testing';
import { createTest, Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';

const app = createTest(AppModule);

describe('AppController', () => {
  let app: Test;

  beforeAll(async () => {
    await app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return 200', async () => {
      const res = await request(app.getHttpServer()).get('/');
      expect(res.status).toBe(200);
    });
  });
});
```

**test/integration/user.spec.ts**
```typescript
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController', () => {
  let app: request.SuperAgentTest;

  beforeAll(async () => {
    app = await request(AppModule);
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const res = await app.get('/users/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, name: 'John Doe' });
    });
  });

  describe('POST /users', () => {
    it('should create user', async () => {
      const user = { name: 'Jane Doe', email: 'jane.doe@example.com' };
      const res = await app.post('/users').send(user);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user', async () => {
      const user = { name: 'Jane Doe Updated', email: 'jane.doe.updated@example.com' };
      const res = await app.put('/users/1').send(user);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, name: 'Jane Doe Updated', email: 'jane.doe.updated@example.com' });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      const res = await app.delete('/users/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1 });
    });
  });
});
```

**test/auth.spec.ts**
```typescript
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication', () => {
  let app: request.SuperAgentTest;

  beforeAll(async () => {
    app = await request(AppModule);
  });

  describe('POST /login', () => {
    it('should return token on successful login', async () => {
      const user = { username: 'john', password: 'password' };
      const res = await app.post('/login').send(user);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should return 401 on invalid login', async () => {
      const user = { username: 'john', password: 'wrongpassword' };
      const res = await app.post('/login').send(user);
      expect(res.status).toBe(401);
    });

    it('should return 400 on missing credentials', async () => {
      const res = await app.post('/login').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /register', () => {
    it('should create new user', async () => {
      const user = { username: 'jane', password: 'password' };
      const res = await app.post('/register').send(user);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 1, username: 'jane', password: 'password' });
    });

    it('should return 400 on invalid registration', async () => {
      const user = { username: 'jane', password: 'wrongpassword' };
      const res = await app.post('/register').send(user);
      expect(res.status).toBe(400);
    });
  });
});
```

**test/error.spec.ts**
```typescript
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Error Handling', () => {
  let app: request.SuperAgentTest;

  beforeAll(async () => {
    app = await request(AppModule);
  });

  describe('404 Not Found', () => {
    it('should return 404 on non-existent route', async () => {
      const res = await app.get('/non-existent-route');
      expect(res.status).toBe(404);
    });
  });

  describe('500 Internal Server Error', () => {
    it('should return 500 on server error', async () => {
      const res = await app.get('/users/non-existent-id');
      expect(res.status).toBe(500);
    });
  });

  describe('400 Bad Request', () => {
    it('should return 400 on missing credentials', async () => {
      const res = await app.post('/login').send({});
      expect(res.status).toBe(400);
    });
  });
});
```