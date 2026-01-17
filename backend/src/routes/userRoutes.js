const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');
const { getStores, submitRating, updateRating } = require('../controllers/userController');

// All user routes are protected and require user role
router.use(authMiddleware);
router.use(authorizeRole(['user']));

// GET /api/user/stores - List stores with ratings
router.get('/stores', getStores);

// POST /api/user/ratings - Submit a rating
router.post('/ratings', submitRating);

// PATCH /api/user/ratings/:storeId - Update rating for a store
router.patch('/ratings/:storeId', updateRating);

module.exports = router;
