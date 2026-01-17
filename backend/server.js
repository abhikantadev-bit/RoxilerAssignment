const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
const { initializeDatabase } = require('./src/config/database');
initializeDatabase();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/user', require('./src/routes/userRoutes'));
app.use('/api/owner', require('./src/routes/ownerRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
