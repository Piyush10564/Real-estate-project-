require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const seedDatabase = require('./seed');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

app.set('trust proxy', 1);

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
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('Blocked Origin:', origin);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

/* =========================================
   SOCKET.IO CONFIG
========================================= */

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store active user connections
const userConnections = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user:join', (userId) => {
    userConnections[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on('message:send', async (data) => {
    try {
      const Message = require('./models/Message');
      const { inquiryId, senderId, recipientId, message } = data;

      const newMessage = new Message({
        inquiry: inquiryId,
        sender: senderId,
        recipient: recipientId,
        message: message,
      });

      await newMessage.save();
      await newMessage.populate('sender', 'firstName lastName profileImage');

      if (userConnections[recipientId]) {
        io.to(userConnections[recipientId]).emit('message:receive', {
          _id: newMessage._id,
          inquiry: inquiryId,
          sender: newMessage.sender,
          message: message,
          createdAt: newMessage.createdAt,
        });
      }

      socket.emit('message:sent', {
        _id: newMessage._id,
        message: message,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message:error', { error: error.message });
    }
  });

  socket.on('message:markRead', async (messageId) => {
    try {
      const Message = require('./models/Message');
      await Message.findByIdAndUpdate(messageId, { isRead: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  socket.on('disconnect', () => {
    for (const userId in userConnections) {
      if (userConnections[userId] === socket.id) {
        delete userConnections[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================================
   DATABASE CONNECTION
========================================= */

// Check if MONGODB_URI is provided (with fallback to MONGO_URI for local development)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ CRITICAL ERROR: MONGODB_URI environment variable is not set!');
  console.error('Please set MONGODB_URI in your environment variables.');
  if (process.env.NODE_ENV === 'production') {
    console.error('On Render: Go to Settings > Environment Variables and add MONGODB_URI');
  } else {
    console.error('Locally: Add MONGODB_URI to your .env file');
  }
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
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
   MONGODB CONNECTION EVENTS
========================================= */
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
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
app.use('/api/messages', require('./routes/messages'));

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
  res.json({ status: 'Server is running' });
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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
