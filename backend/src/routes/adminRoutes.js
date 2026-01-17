const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore
} = require('../controllers/adminController');

// All admin routes are protected and require admin role
router.use(authMiddleware);
router.use(authorizeRole(['admin']));

// GET /api/admin/dashboard - Get dashboard stats
router.get('/dashboard', getDashboard);

// GET /api/admin/users - List all users
router.get('/users', getUsers);

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', getUserById);

// POST /api/admin/users - Create new user
router.post('/users', createUser);

// GET /api/admin/stores - List all stores
router.get('/stores', getStores);

// POST /api/admin/stores - Create new store
router.post('/stores', createStore);

module.exports = router;
