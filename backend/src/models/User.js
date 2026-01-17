const { db } = require('../config/database');

class User {
  // Create a new user
  static create(userData) {
    return new Promise((resolve, reject) => {
      const { name, email, password, address, role } = userData;
      db.run(
        `INSERT INTO Users (name, email, password, address, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, address || null, role],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              name,
              email,
              address,
              role,
              created_at: new Date().toISOString()
            });
          }
        }
      );
    });
  }

  // Find user by email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM Users WHERE email = ?`,
        [email],
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

  // Find user by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, address, role, created_at FROM Users WHERE id = ?`,
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

  // Update user password
  static updatePassword(userId, hashedPassword) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Users SET password = ? WHERE id = ?`,
        [hashedPassword, userId],
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

  // Get all users with filters and pagination
  static findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `SELECT id, name, email, address, role, created_at FROM Users WHERE 1=1`;
      const params = [];

      if (filters.role) {
        query += ` AND role = ?`;
        params.push(filters.role);
      }

      if (filters.name) {
        query += ` AND name LIKE ?`;
        params.push(`%${filters.name}%`);
      }

      if (filters.email) {
        query += ` AND email LIKE ?`;
        params.push(`%${filters.email}%`);
      }

      // Add sorting
      const sortField = filters.sort?.split(':')[0] || 'created_at';
      const sortOrder = filters.sort?.split(':')[1]?.toUpperCase() || 'DESC';
      const allowedFields = ['name', 'email', 'role', 'created_at'];
      
      if (allowedFields.includes(sortField)) {
        query += ` ORDER BY ${sortField} ${sortOrder}`;
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

  // Count total users
  static count() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row?.count || 0);
        }
      });
    });
  }

  // Check if email exists
  static emailExists(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM Users WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(!!row);
          }
        }
      );
    });
  }

  // Update user (for admin)
  static update(userId, userData) {
    return new Promise((resolve, reject) => {
      const { name, email, address, role } = userData;
      db.run(
        `UPDATE Users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?`,
        [name, email, address || null, role, userId],
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

  // Delete user
  static delete(userId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Users WHERE id = ?`,
        [userId],
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

module.exports = User;
