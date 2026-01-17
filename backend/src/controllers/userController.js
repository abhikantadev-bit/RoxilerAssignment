const { ratingSubmitSchema } = require('../validators/validationSchemas');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/user/stores - List stores with user's ratings
const getStores = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    const filters = {};
    if (search) filters.name = search;

    const stores = await Store.findAll(filters);

    // Add user's rating for each store
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const userRating = await Rating.findByUserAndStore(userId, store.id);
        return {
          ...store,
          userRating: userRating?.rating || null
        };
      })
    );

    res.json(storesWithRatings);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// POST /api/user/ratings - Submit rating for a store
const submitRating = async (req, res) => {
  try {
    // Validate input
    const { error, value } = ratingSubmitSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { store_id, rating } = value;
    const user_id = req.user.id;

    // Check if store exists
    const store = await Store.findById(store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Create or update rating
    const result = await Rating.createOrUpdate({
      user_id,
      store_id,
      rating
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: result
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// PATCH /api/user/ratings/:storeId - Update rating for a store
const updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if rating exists
    const existingRating = await Rating.findByUserAndStore(userId, storeId);
    if (!existingRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Update rating
    const result = await Rating.createOrUpdate({
      user_id: userId,
      store_id: storeId,
      rating
    });

    res.json({
      message: 'Rating updated successfully',
      rating: result
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

module.exports = {
  getStores,
  submitRating,
  updateRating
};
