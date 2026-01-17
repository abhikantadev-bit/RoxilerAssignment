# Database Initialization Complete ✅

## Summary

The SQLite database has been successfully initialized with all required tables and schema.

### Database Location
```
database/roxiler.db
```

## Tables Created

### 1. **Users Table**
Stores all user data including admins, normal users, and store owners.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| name | TEXT | NOT NULL | User's full name (20-60 chars) |
| email | TEXT | UNIQUE, NOT NULL | User's email (validated) |
| password | TEXT | NOT NULL | Hashed password (8-16 chars with uppercase & special char) |
| address | TEXT | NULLABLE | User's address (max 400 chars) |
| role | TEXT | NOT NULL, CHECK(role IN ('admin', 'user', 'owner')) | User role |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

**Indexes:** email

---

### 2. **Stores Table**
Stores registered on the platform, owned by users with 'owner' role.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique store identifier |
| name | TEXT | NOT NULL | Store name (20-60 chars) |
| email | TEXT | UNIQUE, NOT NULL | Store email (validated) |
| address | TEXT | NULLABLE | Store address (max 400 chars) |
| owner_id | INTEGER | NOT NULL, FOREIGN KEY | Links to store owner user |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Store creation timestamp |

**Indexes:** name, owner_id

**Foreign Keys:**
- `owner_id` → `Users(id)` ON DELETE CASCADE

---

### 3. **Ratings Table**
User-submitted ratings for stores with update capability.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique rating identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to rating user |
| store_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to rated store |
| rating | INTEGER | NOT NULL, CHECK(rating >= 1 AND rating <= 5) | Rating value (1-5) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Rating creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, store_id) - Prevents duplicate ratings per user-store pair (updates via replacement)

**Indexes:** store_id, user_id

**Foreign Keys:**
- `user_id` → `Users(id)` ON DELETE CASCADE
- `store_id` → `Stores(id)` ON DELETE CASCADE

---

## Database Features

✅ **Normalization** - Separate tables eliminate data duplication  
✅ **Constraints** - Primary keys, unique emails, role validation, rating range checks  
✅ **Foreign Keys** - Referential integrity with CASCADE delete  
✅ **Indexes** - Optimized queries on frequently accessed fields  
✅ **Timestamps** - Automatic creation/update tracking  
✅ **Cascading Deletes** - Deleting user/store removes related records  

---

## Useful Scripts

### Initialize Database
```bash
npm run init:db
```
Creates all tables and indexes in the database.

### Verify Database Schema
```bash
npm run verify:db
```
Displays all tables, columns, constraints, and foreign keys.

---

## Database Initialization Flow

The database is automatically initialized when:
1. **Backend Server Starts** - `npm start` or `npm run dev` calls `initializeDatabase()`
2. **Manual Script** - Run `npm run init:db` to reinitialize

---

## Important Notes

- Database uses **SQLite3** for lightweight, file-based storage
- Foreign key constraints are **enabled** by default
- Tables are created with **idempotent** CREATE TABLE IF NOT EXISTS
- All passwords must be **hashed with bcrypt** before storage
- Average ratings are computed **dynamically** via SQL queries
- **No data is currently in the database** - ready for user registration and store creation

---

## Next Steps

1. **Implement Controllers** - Add business logic in `backend/src/controllers/`
2. **Create Database Models** - Add helper functions in `backend/src/models/` for queries
3. **Test API Endpoints** - Use Postman or similar to test CRUD operations
4. **Add Sample Data** - Create seed script for testing if needed

---

**Database initialization completed on:** January 17, 2026
