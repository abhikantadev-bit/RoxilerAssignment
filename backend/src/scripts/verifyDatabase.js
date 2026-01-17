const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/roxiler.db');
const db = new sqlite3.Database(dbPath);

console.log('\n=== DATABASE SCHEMA VERIFICATION ===\n');

// Get all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error:', err);
    return;
  }

  console.log('Tables created:');
  tables.forEach(table => {
    console.log(`  ✓ ${table.name}`);
  });

  console.log('\n=== TABLE STRUCTURES ===\n');

  // Get table info for each table
  tables.forEach(table => {
    db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
      if (err) {
        console.error(`Error getting info for ${table.name}:`, err);
        return;
      }

      console.log(`\n${table.name}:`);
      columns.forEach(col => {
        const nullable = col.notnull ? 'NOT NULL' : 'NULLABLE';
        console.log(`  • ${col.name} (${col.type}) - ${nullable}`);
      });

      // Get table constraints
      db.all(`PRAGMA foreign_key_list(${table.name})`, (err, fks) => {
        if (err) {
          console.error(`Error getting FKs for ${table.name}:`, err);
          return;
        }

        if (fks.length > 0) {
          console.log(`  Foreign Keys:`);
          fks.forEach(fk => {
            console.log(`    → ${fk.from} references ${fk.table}(${fk.to})`);
          });
        }

        // After processing all tables, close connection
        if (table === tables[tables.length - 1]) {
          setTimeout(() => {
            db.close();
            console.log('\n=== DATABASE VERIFICATION COMPLETE ===\n');
          }, 100);
        }
      });
    });
  });
});
