```javascript
// Import required modules
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import helmet from 'helmet';

// Set up security headers
const app = express();
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    styleSrc: ["'self'", 'https://cdn.jsdelivr.net'],
  },
}));
app.use(helmet.hsts());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.noSniff());

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set up CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Set up JWT and OAuth2
const jwtSecret = 'your-secret-key';
const oauth2Client = {
  // Your OAuth2 client credentials
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
};

// Set up bcrypt
const bcryptSaltRounds = 12;

// Set up Zod validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Set up login and registration routes
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid email or password');
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Set up news routes
app.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/news', async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = new News({ title, content });
    await news.save();
    res.json({ message: 'News created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Set up OAuth2 callback route
app.get('/oauth2/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokenResponse = await fetch('https://accounts.google.com/o/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${code}&client_id=${oauth2Client.clientId}&client_secret=${oauth2Client.clientSecret}&redirect_uri=${encodeURIComponent('http://localhost:3000/oauth2/callback')}&grant_type=authorization_code`,
    });
    const tokenData = await tokenResponse.json();
    const userDataResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userData = await userDataResponse.json();
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      const newUser = new User({ email: userData.email });
      await newUser.save();
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Set up JWT access/refresh rotation
app.post('/rotate-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, jwtSecret);
    const newToken = jwt.sign({ userId: decoded.userId }, jwtSecret, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ userId: decoded.userId }, jwtSecret, { expiresIn: '7d' });
    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    res.status(401).send('Invalid refresh token');
  }
});

// Set up XSS sanitize
app.use((req, res, next) => {
  if (req.method === 'POST') {
    const { body } = req;
    for (const key in body) {
      if (typeof body[key] === 'string') {
        body[key] = sanitizeHtml(body[key]);
      }
    }
  }
  next();
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
```
```javascript
// User model
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

export default User;
```
```javascript
// News model
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);

export default News;
```