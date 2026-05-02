require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedDatabase = require('./seed');

const app = express();

/* =========================================
   CORS CONFIG
========================================= */

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [
      'http://localhost:3000',
      'https://propify-alpha.vercel.app',
      'https://www.propify-alpha.vercel.app',
      'https://propify-vi62.onrender.com',
    ];

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (server-to-server or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Blocked Origin:', origin);

    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],

  credentials: true,
};

/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  })
);

/* =========================================
   DATABASE CONNECTION
========================================= */

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(async () => {
    console.log('MongoDB connected successfully');

    try {
      const Property = require('./models/Property');
      const existingCount = await Property.countDocuments();

      if (existingCount === 0) {
        console.log('No properties found in database. Seeding sample data.');
        await seedDatabase({ disconnect: false });
      } else {
        console.log(`Database already has ${existingCount} properties. Skipping seed.`);
      }
    } catch (err) {
      console.error('Error checking sample data:', err);
    }
  })

  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

/* =========================================
   ROUTES
========================================= */

app.use('/api/auth', require('./routes/auth'));

app.use('/api/properties', require('./routes/properties'));

app.use('/api/reviews', require('./routes/reviews'));

app.use('/api/users', require('./routes/users'));

app.use('/api/favorites', require('./routes/favorites'));

app.use('/api/inquiries', require('./routes/inquiries'));

const SEED_SECRET = process.env.SEED_SECRET;

if (SEED_SECRET) {
  app.post('/api/seed', async (req, res) => {
    const secret = req.query.secret;

    if (secret !== SEED_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      console.log('Manual seed requested');
      await seedDatabase({ disconnect: false });
      return res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Manual seed failed:', error);
      return res.status(500).json({ message: 'Seed failed', error: error.message });
    }
  });
}

/* =========================================
   HEALTH CHECK
========================================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
  });
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

/* =========================================
   SERVER
========================================= */

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});