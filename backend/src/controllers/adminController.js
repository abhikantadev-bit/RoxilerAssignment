const bcrypt = require('bcrypt');
const { storeSchema, userCreationSchema } = require('../validators/validationSchemas');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/admin/dashboard - Get dashboard statistics
const getDashboard = async (req, res) => {
  try {
    const usersCount = await User.count();
    const storesCount = await Store.count();
    const ratingsCount = await Rating.count();

    res.json({
      usersCount,
      storesCount,
      ratingsCount
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// GET /api/admin/users - List all users with filters
const getUsers = async (req, res) => {
  try {
    const { name, email, role, sort } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (email) filters.email = email;
    if (role) filters.role = role;
    if (sort) filters.sort = sort;

    const users = await User.findAll(filters);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// GET /api/admin/users/:id - Get user details
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is a store owner, get their store info
    if (user.role === 'owner') {
      const stores = await Store.findAll({ owner_id: id });
      user.stores = stores;

      // Get ratings for all stores
      if (stores.length > 0) {
        const ratings = await Rating.findByStore(stores[0].id);
        user.ratings = ratings;
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// POST /api/admin/users - Create new user
const createUser = async (req, res) => {
  try {
    // Validate input
    const { error, value } = userCreationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password, address, role } = value;

    // Check if email already exists
    const userExists = await User.emailExists(email);
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// GET /api/admin/stores - List all stores with filters
const getStores = async (req, res) => {
  try {
    const { name, sort } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (sort) filters.sort = sort;

    const stores = await Store.findAll(filters);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// POST /api/admin/stores - Create new store
const createStore = async (req, res) => {
  try {
    // Validate input
    const { error, value } = storeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, address, owner_id } = value;

    // Check if owner exists
    const owner = await User.findById(owner_id);
    if (!owner) {
      return res.status(400).json({ error: 'Owner user not found' });
    }

    // Check if owner has 'owner' role
    if (owner.role !== 'owner') {
      return res.status(400).json({ error: 'User must have owner role to own a store' });
    }

    // Check if email already exists
    const storeExists = await Store.emailExists(email);
    if (storeExists) {
      return res.status(400).json({ error: 'Store email already registered' });
    }

    // Create store
    const newStore = await Store.create({
      name,
      email,
      address: address || null,
      owner_id
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: newStore
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore
};
