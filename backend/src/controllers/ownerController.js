const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/owner/dashboard - Get owner's dashboard with store ratings
const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get owner's stores
    const stores = await Store.findAll({ owner_id: ownerId });

    if (stores.length === 0) {
      return res.json({
        message: 'No stores found',
        stores: [],
        totalAverageRating: 0,
        totalRatings: 0
      });
    }

    // Get ratings for all owner's stores
    let totalRatings = 0;
    let totalRatingSum = 0;

    const storesWithDetails = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.findByStore(store.id);
        const avgData = await Rating.getAverageByStore(store.id);

        totalRatings += ratings.length;
        if (avgData.averageRating) {
          totalRatingSum += avgData.averageRating * ratings.length;
        }

        return {
          ...store,
          ratings: ratings,
          averageRating: avgData.averageRating,
          ratingCount: avgData.ratingCount
        };
      })
    );

    const totalAverageRating = totalRatings > 0 ? (totalRatingSum / totalRatings).toFixed(2) : 0;

    res.json({
      stores: storesWithDetails,
      totalAverageRating: parseFloat(totalAverageRating),
      totalRatings: totalRatings
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = {
  getDashboard
};
