require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// -------------------------
// 1) CORS + MIDDLEWARE
// -------------------------
app.use(
  cors({
    origin: ["https://borrowbuddy.vercel.app", "http://localhost:5173"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// -------------------------
// 2) ROUTES
// -------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/protected'));
app.use('/api/items', require('./routes/items'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// -------------------------
// 3) Mongo + Server Start
// -------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch(err => console.error("MongoDB error", err));
