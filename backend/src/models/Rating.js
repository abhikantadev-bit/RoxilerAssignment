const { db } = require('../config/database');

class Rating {
  // Create or update rating
  static createOrUpdate(ratingData) {
    return new Promise((resolve, reject) => {
      const { user_id, store_id, rating } = ratingData;

      // First try to update existing rating
      db.run(
        `INSERT INTO Ratings (user_id, store_id, rating, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, store_id) DO UPDATE SET 
         rating = excluded.rating,
         updated_at = CURRENT_TIMESTAMP`,
        [user_id, store_id, rating],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              user_id,
              store_id,
              rating,
              updated_at: new Date().toISOString()
            });
          }
        }
      );
    });
  }

  // Find rating by user and store
  static findByUserAndStore(user_id, store_id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM Ratings WHERE user_id = ? AND store_id = ?`,
        [user_id, store_id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  // Get all ratings for a store with rater details
  static findByStore(store_id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          r.id,
          r.rating,
          r.created_at,
          r.updated_at,
          u.id as user_id,
          u.name as user_name,
          u.email as user_email
        FROM Ratings r
        JOIN Users u ON r.user_id = u.id
        WHERE r.store_id = ?
        ORDER BY r.created_at DESC`,
        [store_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  // Get all ratings by a user
  static findByUser(user_id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          r.id,
          r.store_id,
          r.rating,
          r.created_at,
          s.name as store_name,
          s.email as store_email
        FROM Ratings r
        JOIN Stores s ON r.store_id = s.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC`,
        [user_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  // Count total ratings
  static count() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM Ratings`, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row?.count || 0);
        }
      });
    });
  }

  // Get average rating for a store
  static getAverageByStore(store_id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          ROUND(AVG(rating), 2) as averageRating,
          COUNT(*) as ratingCount
        FROM Ratings
        WHERE store_id = ?`,
        [store_id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              averageRating: row?.averageRating || 0,
              ratingCount: row?.ratingCount || 0
            });
          }
        }
      );
    });
  }

  // Delete rating
  static delete(ratingId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Ratings WHERE id = ?`,
        [ratingId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ success: true });
          }
        }
      );
    });
  }
}

module.exports = Rating;
