const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/ownerController');

// All owner routes are protected and require owner role
router.use(authMiddleware);
router.use(authorizeRole(['owner']));

// GET /api/owner/dashboard - Get owner dashboard with ratings
router.get('/dashboard', getDashboard);

module.exports = router;
