require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const defaultOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .join(',');

const allowedOrigins = defaultOrigins
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

const allowAllOrigins = allowedOrigins.length === 0;
if (allowAllOrigins) {
  console.warn('No FRONTEND_URL or CORS_ORIGIN configured; allowing all origins for CORS. Set one of these env vars for production safety.');
}

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients.
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured origins from env.
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow localhost/127.0.0.1 on any port.
    const isLocalDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (process.env.NODE_ENV !== 'production' && isLocalDevOrigin) {
      return callback(null, true);
    }

    // Fallback for missing production config.
    if (allowAllOrigins) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/inquiries', require('./routes/inquiries'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
