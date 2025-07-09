// הגדרת האפליקציה: security, parsers, CORS, session, routes, error handling

const express = require('express');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redis  = require('redis');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const {
  NODE_ENV,
  SESSION_KEY,
  REDIS_PASSWORD,
} = require('./config/env');

const app = express();

app.set('trust proxy', 1); 

// 1) Security headers
app.use(helmet());

// 2) Body parsers with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// 3) CORS
if (NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
}

// 4) Logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// 5) Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 100,                 // 100 בקשות לכל IP
}));

// 6) Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 7) Session with Redis store
const client = redis.createClient({
  username: 'default',
  password: REDIS_PASSWORD,
  socket: {
      host: 'redis-14295.crce197.us-east-2-1.ec2.redns.redis-cloud.com',
      port: 14295
  }
});
app.use(session({
  store: new RedisStore({ client: client }),
  secret: SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,       // שעתיים
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  },
}));


// 8) Routes
app.use('/users', require('./api/routes/users'));
app.use('/products', require('./api/routes/products'));
app.use('/lessons', require('./api/routes/lessons'));
app.use('/schedule', require('./api/routes/schedule'));
app.use('/notification', require('./api/routes/notification'));
app.use('/busyEvents', require('./api/routes/busyEvents'));
app.use('/daily', require('./api/routes/daily'));
app.use('/email', require('./api/routes/email'));

// 9) 404 + Global error handler
app.use((req, res, next) => next(Object.assign(new Error('Not Found'), { status: 404 })));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});

module.exports = app;
