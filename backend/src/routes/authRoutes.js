const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { signup, login, updatePassword } = require('../controllers/authController');

// POST /api/auth/signup - Register a new normal user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// PATCH /api/auth/update-password - Update password (protected)
router.patch('/update-password', authMiddleware, updatePassword);

module.exports = router;
