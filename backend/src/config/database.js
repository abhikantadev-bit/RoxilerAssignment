const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './database/roxiler.db';

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

const initializeDatabase = () => {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        address TEXT,
        role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'owner')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating Users table:', err);
      else console.log('Users table ready');
    });

    // Create Stores table
    db.run(`
      CREATE TABLE IF NOT EXISTS Stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        address TEXT,
        owner_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating Stores table:', err);
      else console.log('Stores table ready');
    });

    // Create Ratings table
    db.run(`
      CREATE TABLE IF NOT EXISTS Ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        store_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES Stores(id) ON DELETE CASCADE,
        UNIQUE(user_id, store_id)
      )
    `, (err) => {
      if (err) console.error('Error creating Ratings table:', err);
      else console.log('Ratings table ready');
    });

    // Create indexes for performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_stores_name ON Stores(name)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON Stores(owner_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON Ratings(store_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON Ratings(user_id)`);
  });
};

module.exports = { db, initializeDatabase };
