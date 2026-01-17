const { db } = require('../config/database');

class Store {
  // Create a new store
  static create(storeData) {
    return new Promise((resolve, reject) => {
      const { name, email, address, owner_id } = storeData;
      db.run(
        `INSERT INTO Stores (name, email, address, owner_id) 
         VALUES (?, ?, ?, ?)`,
        [name, email, address || null, owner_id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              name,
              email,
              address,
              owner_id,
              created_at: new Date().toISOString()
            });
          }
        }
      );
    });
  }

  // Find store by ID with average rating
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          s.id, 
          s.name, 
          s.email, 
          s.address, 
          s.owner_id, 
          s.created_at,
          ROUND(AVG(r.rating), 2) as averageRating,
          COUNT(r.id) as ratingCount
        FROM Stores s
        LEFT JOIN Ratings r ON s.id = r.store_id
        WHERE s.id = ?
        GROUP BY s.id`,
        [id],
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

  // Find all stores with average ratings and filters
  static findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          s.id, 
          s.name, 
          s.email, 
          s.address, 
          s.owner_id, 
          s.created_at,
          ROUND(AVG(r.rating), 2) as averageRating,
          COUNT(r.id) as ratingCount
        FROM Stores s
        LEFT JOIN Ratings r ON s.id = r.store_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.name) {
        query += ` AND s.name LIKE ?`;
        params.push(`%${filters.name}%`);
      }

      if (filters.owner_id) {
        query += ` AND s.owner_id = ?`;
        params.push(filters.owner_id);
      }

      query += ` GROUP BY s.id`;

      // Add sorting
      const sortField = filters.sort?.split(':')[0] || 'created_at';
      const sortOrder = filters.sort?.split(':')[1]?.toUpperCase() || 'DESC';
      const allowedFields = ['name', 'averageRating', 'created_at'];

      if (sortField === 'averageRating') {
        query += ` ORDER BY AVG(r.rating) ${sortOrder}`;
      } else if (allowedFields.includes(sortField)) {
        query += ` ORDER BY s.${sortField} ${sortOrder}`;
      }

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  // Count total stores
  static count() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM Stores`, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row?.count || 0);
        }
      });
    });
  }

  // Check if email exists
  static emailExists(email, excludeId = null) {
    return new Promise((resolve, reject) => {
      let query = `SELECT id FROM Stores WHERE email = ?`;
      const params = [email];

      if (excludeId) {
        query += ` AND id != ?`;
        params.push(excludeId);
      }

      db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });
  }

  // Update store
  static update(storeId, storeData) {
    return new Promise((resolve, reject) => {
      const { name, email, address } = storeData;
      db.run(
        `UPDATE Stores SET name = ?, email = ?, address = ? WHERE id = ?`,
        [name, email, address || null, storeId],
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

  // Delete store
  static delete(storeId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Stores WHERE id = ?`,
        [storeId],
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

module.exports = Store;
