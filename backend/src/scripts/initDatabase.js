require('dotenv').config();
const { db, initializeDatabase } = require('../config/database');

console.log('Starting database initialization...');

initializeDatabase();

// Give the database a moment to create tables
setTimeout(() => {
  console.log('Database initialization complete!');
  console.log('Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    } else {
      console.log('Database connection closed successfully.');
      process.exit(0);
    }
  });
}, 2000);
