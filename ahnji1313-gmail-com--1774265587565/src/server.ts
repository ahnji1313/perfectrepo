```typescript
// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { newsRouter } from './routes/news';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

interface User {
  email: string;
}

interface JWTPayload {
  user: User;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const payload = jwt.verify(token, 'secretkey') as JWTPayload;
    req.user = payload.user;
    next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
};

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.email === 'ahnji1313@gmail.com') {
    next();
  } else {
    return res.status(403).send('Forbidden');
  }
};

app.use('/news', authenticate, adminMiddleware, newsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
```

```typescript
// src/routes/news.ts
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';

const newsRouter = Router();

const newsSchema = z.object({
  title: z.string().min(2).max(4),
  content: z.string(),
});

newsRouter.get('/', async (req, res) => {
  const news = await prisma.news.findMany();
  res.json(news);
});

newsRouter.post('/', async (req, res) => {
  const { title, content } = newsSchema.parse(req.body);
  const news = await prisma.news.create({ data: { title, content } });
  res.json(news);
});

newsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return res.status(404).send('News not found');
  res.json(news);
});

newsRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, content } = newsSchema.parse(req.body);
  const news = await prisma.news.update({ where: { id }, data: { title, content } });
  if (!news) return res.status(404).send('News not found');
  res.json(news);
});

newsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await prisma.news.delete({ where: { id } });
  res.json({ message: 'News deleted successfully' });
});

export { newsRouter };
```

```typescript
// src/prisma/schema.prisma
model News {
  id       String   @id @default(cuid())
  title    String
  content  String
}
```

```typescript
// src/prisma/index.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma };
```