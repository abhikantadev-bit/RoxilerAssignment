# Roxiler Store Ratings Application

A full-stack web application for submitting and managing store ratings with role-based access control.

## 📋 Project Structure

```
RoxilerAssignment/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API endpoint definitions
│   │   ├── controllers/    # Business logic (to be implemented)
│   │   ├── middleware/     # Authentication & authorization
│   │   ├── models/         # Database models (to be implemented)
│   │   ├── validators/     # Input validation schemas
│   │   └── config/         # Database configuration
│   ├── server.js           # Express app entry point
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/                # React.js SPA
│   ├── src/
│   │   ├── pages/          # Role-based dashboard pages
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API integration (axios)
│   │   ├── context/        # Global auth state
│   │   ├── utils/          # Helper functions & validations
│   │   ├── App.js          # Main routing component
│   │   └── index.js        # React DOM render
│   ├── public/             # Static files
│   ├── package.json        # Frontend dependencies
│   └── .env.example        # Environment variables template
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your JWT_SECRET:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_very_secure_secret_key_change_this
   JWT_EXPIRE=7d
   DATABASE_PATH=./database/roxiler.db
   ```

4. **Start the backend server:**
   ```bash
   npm run dev  # With hot reload (requires nodemon)
   # or
   npm start    # Regular start
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Default API URL should work if backend is running locally.

4. **Start the development server:**
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

### Running Both Servers Concurrently (Optional)

From the root directory, you can use `concurrently` package:

```bash
npm install -g concurrently
concurrently "cd backend && npm start" "cd frontend && npm start"
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL (20-60 chars),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL (hashed),
  address TEXT (max 400 chars),
  role TEXT NOT NULL (admin | user | owner),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Stores Table
```sql
CREATE TABLE Stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL (20-60 chars),
  email TEXT UNIQUE NOT NULL,
  address TEXT (max 400 chars),
  owner_id INTEGER NOT NULL REFERENCES Users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Ratings Table
```sql
CREATE TABLE Ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES Users(id),
  store_id INTEGER NOT NULL REFERENCES Stores(id),
  rating INTEGER NOT NULL (1-5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, store_id)
)
```

## 🔐 Authentication & Authorization

- **JWT-based Authentication**: After login, users receive a JWT token valid for 7 days
- **Role-based Access Control**: Three roles with specific permissions
  - **Admin**: Full access to manage users, stores, and view all data
  - **User**: Can search stores and submit/update ratings
  - **Owner**: Can view their store ratings and raters

## 📡 API Endpoints

### Auth Routes (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new normal user |
| POST | `/api/auth/login` | Login user (returns JWT) |
| PATCH | `/api/auth/update-password` | Update password (authenticated) |

### Admin Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get dashboard statistics |
| GET | `/api/admin/users` | List all users (supports filters/sort) |
| GET | `/api/admin/users/:id` | Get user details |
| POST | `/api/admin/users` | Create new user |
| GET | `/api/admin/stores` | List all stores (supports filters/sort) |
| POST | `/api/admin/stores` | Create new store |

### User Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/stores` | List stores with ratings (search supported) |
| POST | `/api/user/ratings` | Submit rating for a store |
| PATCH | `/api/user/ratings/:storeId` | Update rating for a store |

### Owner Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owner/dashboard` | Get owner's dashboard with store ratings |

## ✅ Form Validations

### Name
- **Length**: 20-60 characters
- **Characters**: Alphanumeric

### Email
- **Format**: Valid email (regex: `/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/`)

### Password
- **Length**: 8-16 characters
- **Requirements**:
  - At least one uppercase letter
  - At least one special character (`!@#$%^&*`)

### Address
- **Length**: Maximum 400 characters

### Rating
- **Range**: 1-5 (integers only)

**Validation is enforced on both frontend (UX) and backend (security).**

## 🎨 Frontend Components

### Pages
- **LoginPage**: User login form
- **SignupPage**: New user registration (normal users only)
- **AdminDashboard**: Statistics and management tables
- **UserDashboard**: Store listing with rating capability
- **OwnerDashboard**: Store rating analytics
- **HomePage**: Landing page
- **UnauthorizedPage**: 403 error page

### Shared Components
- **Header**: Navigation and logout
- **Footer**: App footer
- **ProtectedRoute**: Route guard for authenticated users

### State Management
- **AuthContext**: Global authentication state using React Context API
- **Local State**: Form management with Formik/Yup

## 🔧 Technologies Used

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Joi** - Input validation
- **dotenv** - Environment configuration

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Ant Design** - UI components
- **Formik & Yup** - Form handling & validation

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
DATABASE_PATH=./database/roxiler.db
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## 🧪 Testing

The application includes built-in validation. To test:

1. **Invalid inputs** - Frontend prevents submission, backend validates again
2. **Authentication** - Try accessing protected routes without token
3. **Authorization** - Try accessing admin routes with user role
4. **Duplicate ratings** - Submit second rating for same store (should update)
5. **Email uniqueness** - Try signing up with existing email

## 📦 Deployment

### Backend
- Deploy to Heroku, Railway, or similar
- Set environment variables in platform settings
- Ensure SQLite database persists (or use PostgreSQL for production)

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update `REACT_APP_API_BASE_URL` to production backend URL

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Errors
- Ensure backend has CORS enabled for frontend URL
- Check that both servers are running

### Database Errors
- Delete `database/roxiler.db` to reset database
- Check `DATABASE_PATH` in `.env` matches actual location

## 📚 Next Steps

1. **Implement Controllers** - Add business logic in `backend/src/controllers/`
2. **Implement Models** - Create data access layer in `backend/src/models/`
3. **Add Error Handling** - Implement comprehensive error handling
4. **Add Tests** - Unit and integration tests
5. **Styling** - Customize Ant Design theme
6. **Deployment** - Deploy to cloud platforms

## 📄 License

ISC

## 👤 Author

Roxiler Assignment

---

**For questions or issues, please refer to the assignment requirements document.**
