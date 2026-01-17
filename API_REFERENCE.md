# API Quick Reference Guide

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Routes

### 1. Sign Up (Public)
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe User",
  "email": "john@example.com",
  "password": "Password@123",
  "address": "123 Main Street"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe User",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login (Public)
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe User",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Save the token for future requests!**

---

### 3. Update Password (Protected)
**PATCH** `/auth/update-password`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@456"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

## Admin Routes (All Protected + Admin Role Required)

### 1. Dashboard
**GET** `/admin/dashboard`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "usersCount": 10,
  "storesCount": 5,
  "ratingsCount": 25
}
```

---

### 2. List Users
**GET** `/admin/users?name=John&role=user&sort=name:asc`

**Query Parameters:**
- `name` - Partial name search
- `email` - Partial email search
- `role` - Filter by role (admin, user, owner)
- `sort` - Sort field and order (field:asc or field:desc)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe User",
    "email": "john@example.com",
    "address": "123 Main Street",
    "role": "user",
    "created_at": "2026-01-17T10:30:00.000Z"
  },
  ...
]
```

---

### 3. Get User Details
**GET** `/admin/users/:id`

**Response (200):**
```json
{
  "id": 2,
  "name": "Store Owner",
  "email": "owner@example.com",
  "address": "456 Oak Ave",
  "role": "owner",
  "created_at": "2026-01-17T10:35:00.000Z",
  "stores": [
    {
      "id": 1,
      "name": "Main Store",
      "email": "store@example.com",
      "averageRating": 4.5,
      ...
    }
  ],
  "ratings": [
    {
      "user_id": 1,
      "rating": 5,
      "user_name": "John Doe"
    }
  ]
}
```

---

### 4. Create User
**POST** `/admin/users`

**Request Body:**
```json
{
  "name": "New Admin User",
  "email": "admin@example.com",
  "password": "AdminPass@123",
  "address": "789 Pine Road",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 5,
    "name": "New Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

### 5. List Stores
**GET** `/admin/stores?name=Main&sort=averageRating:desc`

**Query Parameters:**
- `name` - Partial store name search
- `sort` - Sort options

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Main Store",
    "email": "main@example.com",
    "address": "123 Main St",
    "owner_id": 2,
    "averageRating": 4.5,
    "ratingCount": 10,
    "created_at": "2026-01-17T10:40:00.000Z"
  }
]
```

---

### 6. Create Store
**POST** `/admin/stores`

**Request Body:**
```json
{
  "name": "New Shopping Mall",
  "email": "mall@example.com",
  "address": "999 Shopping District",
  "owner_id": 2
}
```

**Response (201):**
```json
{
  "message": "Store created successfully",
  "store": {
    "id": 3,
    "name": "New Shopping Mall",
    "email": "mall@example.com",
    "owner_id": 2,
    ...
  }
}
```

---

## User Routes (All Protected + User Role Required)

### 1. List Stores
**GET** `/user/stores?search=Main`

**Query Parameters:**
- `search` - Search stores by name/address

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Main Store",
    "email": "main@example.com",
    "address": "123 Main St",
    "averageRating": 4.5,
    "ratingCount": 10,
    "userRating": null
  },
  ...
]
```

---

### 2. Submit Rating
**POST** `/user/ratings`

**Request Body:**
```json
{
  "store_id": 1,
  "rating": 5
}
```

**Response (201):**
```json
{
  "message": "Rating submitted successfully",
  "rating": {
    "user_id": 1,
    "store_id": 1,
    "rating": 5,
    "updated_at": "2026-01-17T10:50:00.000Z"
  }
}
```

---

### 3. Update Rating
**PATCH** `/user/ratings/:storeId`

**Request Body:**
```json
{
  "rating": 4
}
```

**Response (200):**
```json
{
  "message": "Rating updated successfully",
  "rating": {
    "user_id": 1,
    "store_id": 1,
    "rating": 4,
    "updated_at": "2026-01-17T10:55:00.000Z"
  }
}
```

---

## Owner Routes (All Protected + Owner Role Required)

### 1. Dashboard
**GET** `/owner/dashboard`

**Response (200):**
```json
{
  "stores": [
    {
      "id": 1,
      "name": "My Store",
      "email": "mystore@example.com",
      "averageRating": 4.7,
      "ratingCount": 15,
      "ratings": [
        {
          "user_id": 5,
          "rating": 5,
          "user_name": "Customer A",
          "user_email": "customerA@example.com",
          "created_at": "2026-01-16T08:30:00.000Z"
        }
      ]
    }
  ],
  "totalAverageRating": 4.7,
  "totalRatings": 15
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Email already registered"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 403 - Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 - Not Found
```json
{
  "error": "User not found"
}
```

### 500 - Server Error
```json
{
  "error": "Failed to fetch dashboard data"
}
```

---

## Password Requirements

- **Length**: 8-16 characters
- **Uppercase**: At least one uppercase letter (A-Z)
- **Special Character**: At least one special character (!@#$%^&*)

**Valid Examples:**
- `Password@123`
- `MySecure!Pass`
- `Admin#2026`

**Invalid Examples:**
- `password@123` (no uppercase)
- `Password123` (no special char)
- `Pass@1` (too short)

---

## Role-Based Access

### Admin
- Manage users (create, list, view details)
- Manage stores (create, list)
- View dashboard with all statistics

### User
- View all stores
- Submit and update ratings

### Owner
- View own store ratings
- See customer reviews

---

## Testing with Postman/cURL

### Example cURL Commands:

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe User","email":"john@test.com","password":"Password@123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Password@123"}'
```

**Get Admin Dashboard:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are positive integers
- Ratings are immutable (UPSERT on duplicate)
- Deleting users/stores cascades to ratings
- Search is case-insensitive
