require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const uploadsDir = path.join(__dirname, '../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGIN || 'https://borrowbuddy.vercel.app,http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// -------------------------
// 1) CORS + MIDDLEWARE
// -------------------------
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

// -------------------------
// 2) ROUTES
// -------------------------
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'borrowbuddy-api',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/protected'));
app.use('/api/items', require('./routes/items'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.message === 'Only image uploads are allowed') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image must be 5MB or smaller' });
  }

  return res.status(500).json({ message: 'Server error' });
});

// -------------------------
// 3) Mongo + Server Start
// -------------------------
async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are required');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}

start().catch(err => {
  console.error("Server startup error", err);
  process.exit(1);
});

module.exports = app;
